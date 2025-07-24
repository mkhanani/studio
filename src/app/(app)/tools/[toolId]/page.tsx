"use client"

import { useParams } from "next/navigation"
import useMockDb from "@/hooks/use-mock-db"
import { useEffect, useState, useRef } from "react"
import { Tool } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { runGenericPlaygroundAction, generateImageAction, generateAudioAction } from "@/app/actions"
import { Loader2, Send, Bot, User as UserIcon, AlertTriangle, Image as ImageIcon, Mic } from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Message = {
  role: 'user' | 'assistant'
  content: string | { imageUrl: string } | { audioUrl: string }
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

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tools.length === 0) return; // Wait for tools to be loaded

    const foundTool = tools.find(t => t.id === toolId)
    if (foundTool) {
      if (foundTool.type === 'Web-based') {
        setError("This tool is web-based and does not have an integrated playground.")
      } else {
        setTool(foundTool)
        let initialMessage = `Hello! I'm ${foundTool.name}. How can I help you today?`
        if (foundTool.category === 'Image') {
          initialMessage = `Hello! I'm ${foundTool.name}. Describe the image you want me to create.`
        } else if (foundTool.category === 'Audio') {
            initialMessage = `Hello! I'm ${foundTool.name}. Enter the text you want me to narrate.`
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

  const handleSend = async () => {
    if (!prompt.trim() || !tool) return

    const newMessages: Message[] = [...messages, { role: 'user', content: prompt }]
    setMessages(newMessages)
    setLoading(true)
    setError(null)
    const currentPrompt = prompt
    setPrompt("")

    try {
      if (tool.category === 'Image') {
        const result = await generateImageAction({ prompt: currentPrompt })
        if (result.success && result.data) {
          setMessages([...newMessages, { role: 'assistant', content: { imageUrl: result.data.imageUrl } }])
        } else {
          throw new Error(result.error || "Failed to generate image.")
        }
      } else if (tool.category === 'Audio') {
        const result = await generateAudioAction({ prompt: currentPrompt })
        if (result.success && result.data?.audioUrl) {
          setMessages([...newMessages, { role: 'assistant', content: { audioUrl: result.data.audioUrl } }])
        } else {
            throw new Error(result.error || "Failed to generate audio.")
        }
      } else {
        const result = await runGenericPlaygroundAction({ prompt: currentPrompt, toolName: tool.name })
        if (result.success && result.data) {
          setMessages([...newMessages, { role: 'assistant', content: result.data.response }])
        } else {
          throw new Error(result.error || "Failed to get a response from the AI.")
        }
      }
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage)
      setMessages(newMessages) // Keep the user's message even if the call fails
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
          case 'Audio':
              return <Mic className="h-4 w-4" />;
          default:
              return <Send className="h-4 w-4" />;
      }
  }
  
   const getPlaceholderForCategory = (category: Tool['category']) => {
        switch (category) {
            case 'Image':
                return "A photo of a cat sitting on a windowsill...";
            case 'Audio':
                return "Type the text to convert to speech...";
            default:
                return "Type your message here...";
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
    // This case should ideally not be reached if error handling is correct
    return null;
  }


  return (
    <div className="container mx-auto h-[calc(100vh-100px)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
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
                  
                  <div className={`rounded-lg max-w-lg ${message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'} ${typeof message.content !== 'string' || (typeof message.content === 'string' && message.content.trim() === '') ? 'p-0' : 'px-4 py-3'}`}>
                    {typeof message.content === 'string' ? (
                       <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    ) : message.content && 'imageUrl' in message.content ? (
                      <Image src={message.content.imageUrl} alt="Generated Image" width={512} height={512} className="rounded-lg" />
                    ) : message.content && 'audioUrl' in message.content ? (
                      <audio controls src={message.content.audioUrl} className="w-full" />
                    ) : null}
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
             </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6 border-t">
          <div className="flex w-full items-center space-x-2">
            <Input 
                id="prompt" 
                placeholder={getPlaceholderForCategory(tool.category)}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading || !prompt.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : getIconForCategory(tool.category)}
                <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
