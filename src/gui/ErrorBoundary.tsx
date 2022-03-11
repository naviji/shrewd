import React from 'react'
interface ErrorInfo {
    componentStack: string;
}

interface State {
    error: Error;
    errorInfo: ErrorInfo;
}

interface Props {
    message?: string;
    children: any
}

export default class ErrorBoundary extends React.Component<Props, State> {
    public state: State = { error: null, errorInfo: null };

    componentDidCatch (error: any, errorInfo: ErrorInfo) {
      if (typeof error === 'string') error = { message: error }
      this.setState({ error, errorInfo })
    }

    renderMessage () {
      const message = this.props.message || 'App encountered a fatal error and could not continue.'
      return <p>{message}</p>
    }

    render () {
      if (this.state.error) {
        try {
          const output = []

          output.push(
                    <section key="message">
                        <h2>Message</h2>
                        <p>{this.state.error.message}</p>
                    </section>
          )

          if (this.state.error.stack) {
            output.push(
                        <section key="stacktrace">
                            <h2>Stack trace</h2>
                            <pre>{this.state.error.stack}</pre>
                        </section>
            )
          }

          if (this.state.errorInfo) {
            if (this.state.errorInfo.componentStack) {
              output.push(
                            <section key="componentStack">
                                <h2>Component stack</h2>
                                <pre>{this.state.errorInfo.componentStack}</pre>
                            </section>
              )
            }
          }

          return (
                    <div style={{ overflow: 'auto', fontFamily: 'sans-serif', padding: '5px 20px' }}>
                        <h1>Error</h1>
                        {this.renderMessage()}
                        <p>To report the error, please copy the *entire content* of this page and post it on Joplin forum or GitHub.</p>
                        {output}
                    </div>
          )
        } catch (error) {
          return (
                    <div>
                        {JSON.stringify(this.state)}
                    </div>
          )
        }
      }

      return this.props.children
    }
}
