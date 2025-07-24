"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useMockDb from "@/hooks/use-mock-db"
import { getUsageInsightsAction } from "@/app/actions"
import { Lightbulb, FileText, Loader2, AlertTriangle, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Insights = {
  insights: string
  recommendations: string
}

export default function AdminInsightsPage() {
  const { logs } = useMockDb()
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleGenerateInsights = async () => {
    setLoading(true)
    setError(null)
    setInsights(null)

    try {
      const logsJson = JSON.stringify(
        logs.map(log => ({
          tool: log.toolName,
          user: log.userName,
          department: log.department,
          timestamp: log.timestamp.toISOString(),
        })),
        null,
        2
      )

      const result = await getUsageInsightsAction({ logs: logsJson })

      if (result.success && result.data) {
        setInsights(result.data)
        toast({
          title: "Insights Generated",
          description: "Successfully analyzed usage logs.",
        })
      } else {
        throw new Error(result.error || "Failed to generate insights.")
      }
    } catch (e: any) {
      setError(e.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">AI-Powered Usage Insights</h1>
          <p className="text-muted-foreground">Analyze usage logs to find patterns and recommendations.</p>
        </div>
        <Button onClick={handleGenerateInsights} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Insights
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {error && (
            <Alert variant="destructive" className="lg:col-span-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Generation Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {!insights && !loading && !error && (
             <div className="lg:col-span-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
                <Wand2 className="h-12 w-12 text-muted-foreground/50 mb-4"/>
                <h3 className="text-xl font-semibold">Ready to Analyze</h3>
                <p className="mt-2 text-muted-foreground">
                    Click the "Generate Insights" button to start the analysis.
                    <br/>
                    The AI will process all usage logs to identify trends.
                </p>
            </div>
        )}

        {loading && (
            <div className="lg:col-span-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4"/>
                <h3 className="text-xl font-semibold">Analyzing Logs...</h3>
                <p className="mt-2 text-muted-foreground">
                    Our AI is processing the data. This might take a moment.
                </p>
            </div>
        )}

        {insights && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Lightbulb className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="font-headline text-xl">Insights</CardTitle>
                  <CardDescription>Key patterns identified from the logs.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-foreground/90">{insights.insights}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="font-headline text-xl">Recommendations</CardTitle>
                  <CardDescription>Actionable suggestions based on the insights.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-foreground/90">{insights.recommendations}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
