"use client"

import { useParams } from "next/navigation"
import useMockDb from "@/hooks/use-mock-db"
import React, { useEffect, useState, useRef } from "react"
import { Tool } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { runGenericPlaygroundAction, generateImageAction } from "@/app/actions"
import { Loader2, Send, Bot, User as UserIcon, AlertTriangle, Image as ImageIcon, Paperclip, X, Mic, MicOff, Copy, Download } from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type MessageContent = string | { imageUrl: string } | { audioUrl: string } | { prompt: string; file: { name: string, dataUri: string } };

type Message = {
  role: 'user' | 'assistant';
  content: MessageContent;
};

interface CustomWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export default function ToolPlaygroundPage() {
  const params = useParams()
  const toolId = Array.isArray(params.toolId) ? params.toolId[0] : params.toolId;
  const { tools } = useMockDb()
  const { user } = useAuth()
  const { toast } = useToast()

  const [tool, setTool] = useState<Tool | null>(null)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageLoading, setPageLoading] = useState(true);
  const [attachedFile, setAttachedFile] = useState<{name: string, dataUri: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);


  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tools.length === 0) return; 

    const foundTool = tools.find(t => t.id === toolId)
    if (foundTool) {
      if (foundTool.type === 'Web-based') {
        setError("This tool is web-based and does not have an integrated playground.")
      } else {
        setTool(foundTool)
        let initialMessage = `Hello! I'm ${foundTool.name}. How can I help you today?`
        if (foundTool.category === 'Image') {
          initialMessage = `Hello! I'm ${foundTool.name}. Describe the image you want me to create.`
        } else if (foundTool.name === 'Scribe') {
            initialMessage = "Hello! Describe the document you want me to generate. I can create reports, emails, summaries, and more, complete with Markdown formatting."
        } else if (foundTool.name === 'DataGrid') {
            initialMessage = "Hello! Describe the data you want me to generate. I'll create it in CSV format, ready for any spreadsheet software."
        }
        setMessages([
          { role: 'assistant', content: initialMessage }
        ])
      }
    } else {
      setError("Tool not found.")
    }
    setPageLoading(false);
  }, [toolId, tools])

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [messages])
  
   useEffect(() => {
    const customWindow = window as CustomWindow;
    const SpeechRecognition = customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        toast({
          variant: "destructive",
          title: "Voice Error",
          description: `Speech recognition error: ${event.error}`,
        });
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setPrompt(transcript);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

 const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        setAttachedFile({ name: file.name, dataUri });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!prompt.trim() && !attachedFile) || !tool) return

    const userMessageContent: MessageContent = attachedFile 
        ? { prompt: prompt, file: attachedFile } 
        : prompt;

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessageContent }]
    setMessages(newMessages)
    setLoading(true)
    setError(null)
    const currentPrompt = prompt
    const currentFile = attachedFile
    setPrompt("")
    setAttachedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      let result;
      switch (tool.category) {
        case 'Image':
          result = await generateImageAction({ prompt: currentPrompt });
          if (result.success && result.data) {
            setMessages([...newMessages, { role: 'assistant', content: { imageUrl: result.data.imageUrl } }]);
          } else {
            throw new Error(result.error || "Failed to generate image.");
          }
          break;
        case 'Text':
        case 'Web-based': // Should be handled, but as a fallback
        default:
          result = await runGenericPlaygroundAction({ 
            prompt: currentPrompt, 
            toolName: tool.name,
            fileDataUri: currentFile?.dataUri,
          });
          if (result.success && result.data) {
            setMessages([...newMessages, { role: 'assistant', content: result.data.response }]);
          } else {
            throw new Error(result.error || "Failed to get a response from the AI.");
          }
          break;
      }
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage)
      // Do not clear the user's message on failure, but show the error
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }
  
  const getIconForCategory = (category: Tool['category']) => {
      switch (category) {
          case 'Image':
              return <ImageIcon className="h-4 w-4" />;
          default:
              return <Send className="h-4 w-4" />;
      }
  }
  
   const getPlaceholderForCategory = (category: Tool['category']) => {
        switch (category) {
            case 'Image':
                return "A photo of a cat sitting on a windowsill...";
            default:
                return "Type your message or attach a file...";
        }
   }

  if (pageLoading) {
    return (
        <div className="container mx-auto flex items-center justify-center h-[calc(100vh-100px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  if (error && !tool) {
     return (
        <div className="container mx-auto flex items-center justify-center h-[calc(100vh-100px)]">
            <Alert variant="destructive" className="max-w-lg">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
     )
  }
  
  if (!tool) {
    return null; // Don't render if tool is not loaded yet
  }
  
  const toggleListening = () => {
    if (!recognitionRef.current) {
        toast({
          variant: "destructive",
          title: "Unsupported Browser",
          description: "Your browser does not support voice recognition.",
        });
        return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
    });
  };

  const handleDownload = (content: string) => {
    const isCsv = tool?.name === 'DataGrid';
    const isImage = content.startsWith('data:image');
    
    const filename = `GridAI-${tool?.name || 'output'}.${isCsv ? 'csv' : isImage ? 'png' : 'txt'}`;
    const mimeType = isCsv ? 'text/csv' : isImage ? 'image/png' : 'text/plain';
    
    const blob = isImage 
      ? fetch(content).then(res => res.blob())
      : new Blob([content], { type: mimeType });

    Promise.resolve(blob).then(resolvedBlob => {
      const url = URL.createObjectURL(resolvedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };


  const renderMessageContent = (message: Message) => {
    const content = message.content;
    const isAssistant = message.role === 'assistant';

    // Base container for assistant messages to apply group-hover
    const AssistantContainer = ({ children }: { children: React.ReactNode }) => (
      <div className="relative group">{children}</div>
    );
    
    // Actions for copy/download
    const MessageActions = ({ text }: { text: string }) => (
       <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-muted rounded-bl-md p-1">
           <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyToClipboard(text)}>
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDownload(text)}>
              <Download className="h-3 w-3" />
              <span className="sr-only">Download</span>
          </Button>
      </div>
    );


    if (typeof content === 'string') {
      const Wrapper = isAssistant ? AssistantContainer : React.Fragment;
      return (
        <Wrapper>
          <p className="text-sm whitespace-pre-wrap">{content}</p>
          {isAssistant && <MessageActions text={content} />}
        </Wrapper>
      );
    }
    
    if ('imageUrl' in content) {
       const Wrapper = isAssistant ? AssistantContainer : React.Fragment;
        return (
            <Wrapper>
                <Image src={content.imageUrl} alt="Generated Image" width={512} height={512} className="rounded-lg" />
                {isAssistant && <MessageActions text={content.imageUrl} />}
            </Wrapper>
        );
    }

    if ('audioUrl' in content) {
        return <audio controls src={content.audioUrl} className="w-full" />;
    }
    
    if ('file' in content) {
      const isImage = content.file.dataUri.startsWith('data:image');
      return (
        <div className="space-y-2">
            {content.prompt && <p className="text-sm whitespace-pre-wrap">{content.prompt}</p>}
            <div className="border-t border-primary-foreground/20 pt-2">
            {isImage ? (
                <Image src={content.file.dataUri} alt={content.file.name} width={200} height={200} className="rounded-md" />
            ) : (
                <div className="flex items-center gap-2 text-sm rounded-md bg-primary/20 p-2">
                    <Paperclip className="h-4 w-4" />
                    <span>{content.file.name}</span>
                </div>
            )}
            </div>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="container mx-auto h-[calc(100vh-100px)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-col md:flex-row gap-4 items-start">
           <Image
              src={tool.iconUrl}
              alt={`${tool.name} icon`}
              width={48}
              height={48}
              className="rounded-lg"
              data-ai-hint="logo"
            />
          <div>
              <CardTitle className="font-headline text-2xl">{tool.name} Playground</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
             <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-9 w-9 border">
                        <div className="flex h-full w-full items-center justify-center bg-primary/10">
                           <Bot className="h-5 w-5 text-primary" />
                        </div>
                    </Avatar>
                  )}
                  
                   <div className={`rounded-lg max-w-lg ${message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'} ${typeof message.content === 'object' && ('imageUrl' in message.content) ? 'p-0 bg-transparent' : 'px-4 py-3'}`}>
                     {renderMessageContent(message)}
                  </div>

                   {message.role === 'user' && user && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
                {loading && (
                    <div className="flex items-start gap-4">
                         <Avatar className="h-9 w-9 border">
                            <div className="flex h-full w-full items-center justify-center bg-primary/10">
                               <Bot className="h-5 w-5 text-primary" />
                            </div>
                        </Avatar>
                        <div className="rounded-lg px-4 py-3 bg-muted flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                    </div>
                )}
                 {error && !loading && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Generation Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
             </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <div className="w-full space-y-2">
            {attachedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-md">
                    <Paperclip className="h-4 w-4" />
                    <span className="flex-1 truncate">{attachedFile.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                        setAttachedFile(null);
                        if(fileInputRef.current) fileInputRef.current.value = "";
                    }}>
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            <div className="flex w-full items-center space-x-2">
                 <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                    <Paperclip className="h-4 w-4"/>
                    <span className="sr-only">Attach file</span>
                </Button>
                <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <Input 
                    id="prompt" 
                    placeholder={isListening ? "Listening..." : getPlaceholderForCategory(tool.category)}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                    disabled={loading}
                />
                <Button variant="outline" size="icon" onClick={toggleListening} disabled={loading}>
                    {isListening ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
                    <span className="sr-only">Toggle Microphone</span>
                </Button>
                <Button onClick={handleSend} disabled={loading || (!prompt.trim() && !attachedFile)}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : getIconForCategory(tool.category)}
                    <span className="sr-only">Send</span>
                </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
