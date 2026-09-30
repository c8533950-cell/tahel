import {Component,ReactNode} from 'react'
export class ErrorBoundary extends Component<{children:ReactNode},{err:boolean}>{
  state={err:false}
  static getDerivedStateFromError(){return{err:true}}
  render(){
    if(!this.state.err)return this.props.children
    return <div className="app"><main><div className="card"><h2>משהו השתבש</h2>
      <p className="mut">הנתונים שלך שמורים. אפשר לנסות שוב.</p>
      <button className="btn" onClick={()=>this.setState({err:false})}>נסה שוב</button></div></main></div>
  }
}
