"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeftRight,
  Github,
  Linkedin,
  RefreshCw,
  Volume2,
} from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

export default function Component() {
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [isPlayingSource, setIsPlayingSource] = React.useState(false);
  const [isPlayingTarget, setIsPlayingTarget] = React.useState(false);
  const [sourceLang, setSourceLang] = React.useState("en");
  const [targetLang, setTargetLang] = React.useState("cn");
  const [sourceText, setSourceText] = React.useState("");
  const [translatedText, setTranslatedText] = React.useState("");
  // const { toast } = useToast();

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      // toast({
      //   title: "Error",
      //   description: "Please enter some text to translate.",
      //   variant: "destructive",
      // });
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch("http://51.20.178.157:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
    } catch (error) {
      console.error("Translation error:", error);
      // toast({
      //   title: "Error",
      //   description: "An error occurred during translation. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleListen = (type) => {
    if (type === "source") {
      setIsPlayingSource(true);
      // Simulate audio playback for source
      setTimeout(() => setIsPlayingSource(false), 2000);
    } else {
      setIsPlayingTarget(true);
      // Simulate audio playback for target
      setTimeout(() => setIsPlayingTarget(false), 2000);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-5xl">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">LinguaDock</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </Button>
        </div>
      </header>

      <Tabs defaultValue="translate" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="translate">Translation</TabsTrigger>
          <TabsTrigger value="grammar">Grammar Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="translate" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="cn">Chinese</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const temp = sourceLang;
                      setSourceLang(targetLang);
                      setTargetLang(temp);
                      setSourceText(translatedText);
                      setTranslatedText(sourceText);
                    }}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    <span className="sr-only">Swap languages</span>
                  </Button>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cn">Chinese</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text to translate..."
                  className="min-h-[200px] resize-none"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleListen("source")}
                    disabled={isPlayingSource}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {isPlayingSource ? "Playing..." : "Listen"}
                  </Button>
                  <Button onClick={handleTranslate} disabled={isTranslating}>
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        isTranslating ? "animate-spin" : ""
                      }`}
                    />
                    {isTranslating ? "Translating..." : "Translate"}
                  </Button>
                  <Button variant="outline" onClick={() => setSourceText("")}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Translation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-[200px] rounded-md border bg-muted/50 p-4">
                  <p className="text-sm">
                    {translatedText || "Translation will appear here..."}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleListen("target")}
                  disabled={isPlayingTarget}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {isPlayingTarget ? "Playing..." : "Listen"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grammar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grammar Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text for grammar analysis..."
                className="min-h-[200px] resize-none"
              />
              <div className="flex items-center gap-4">
                <Select defaultValue="english">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Explain in" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Analyze</Button>
                <Button variant="outline">Clear</Button>
              </div>
              <div className="rounded-md border bg-muted/50 p-4 min-h-[200px]">
                <p className="text-sm text-muted-foreground">
                  Grammar analysis will appear here...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
