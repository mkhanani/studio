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
import { runGenericPlaygroundAction } from "@/app/actions"
import { Loader2, Send, Bot, User as UserIcon } from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ToolPlaygroundPage() {
  const { toolId } = useParams()
  const { tools } = useMockDb()
  const { user } = useAuth()
  const { toast } = useToast()

  const [tool, setTool] = useState<Tool | null>(null)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const foundTool = tools.find(t => t.id === toolId)
    if (foundTool) {
      if (foundTool.type === 'Web-based') {
        // Redirect or show an error if trying to access a web-based tool here
        setError("This tool is web-based and does not have an integrated playground.")
      } else {
        setTool(foundTool)
        setMessages([
          { role: 'assistant', content: `Hello! I'm ${foundTool.name}. How can I help you today?` }
        ])
      }
    } else {
      setError("Tool not found.")
    }
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
      const result = await runGenericPlaygroundAction({ prompt: currentPrompt, toolName: tool.name })
      if (result.success && result.data) {
        setMessages([...newMessages, { role: 'assistant', content: result.data.response }])
      } else {
        throw new Error(result.error || "Failed to get a response from the AI.")
      }
    } catch (e: any) {
      setError(e.message)
      setMessages(newMessages) // Keep the user's message even if the call fails
       toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  if (error) {
     return (
        <div className="container mx-auto flex items-center justify-center h-full">
            <Alert variant="destructive" className="max-w-lg">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
     )
  }

  if (!tool) {
    return (
        <div className="container mx-auto flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
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
                  <div className={`rounded-lg px-4 py-3 max-w-lg ${message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                placeholder="Type your message here..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading || !prompt.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
