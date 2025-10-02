import { Component, ErrorInfo, ReactNode } from 'react';
import { trackError } from '@/utils/analytics-events';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
    
    // Track error to analytics
    trackError(
      'runtime',
      error.message,
      errorInfo.componentStack?.split('\n')[1]?.trim(),
      error.stack
    );
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
          <Card className="max-w-2xl w-full" data-testid="error-boundary-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Something went wrong</CardTitle>
                  <CardDescription className="mt-1">
                    We encountered an unexpected error. Don't worry, your files are safe!
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium mb-2">Error Details:</p>
                <p className="text-sm text-muted-foreground font-mono break-all">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>
              
              <div className="text-sm space-y-2 text-muted-foreground">
                <p>• All file processing happens in your browser - your files are private and safe</p>
                <p>• This error has been automatically reported to help us improve</p>
                <p>• Try refreshing the page or going back to the home page</p>
              </div>
            </CardContent>
            
            <CardFooter className="gap-3">
              <Button 
                onClick={this.handleReset} 
                variant="default"
                data-testid="button-try-again"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                data-testid="button-home"
              >
                Go to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
