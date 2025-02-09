import "./App.css";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { SpeedInsights } from "@vercel/speed-insights/react";
function App() {
    return (
        <>
            <Header />
            <Main />
            <SpeedInsights />
        </>
    );
}

export default App;
