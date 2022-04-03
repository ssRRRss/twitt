import './App.css';

import { TweetComponent } from "./post"


const App = () =>{
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <TweetComponent />
        </div>
      </header>
    </div>
  );
}


export default App