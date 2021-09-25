import TextEditor from './TextEditor'
import Title from './Title'
import JotterSidebar from './JotterSidebar'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import {v4 as uuidV4 } from 'uuid'



function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/documents/${uuidV4()}`}/>
        </Route>
        <Route path="/documents/:id">
          <Title/>
          <TextEditor/>
          <JotterSidebar/>
        </Route>
      </Switch>
    </Router>

    </>
  );
}

export default App;
