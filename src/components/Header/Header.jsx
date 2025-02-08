import logo from "/src/assets/chef-chatgpt-icon.png";
import "./Header.css";

export default function Header() {
    return (
        <header>
            <img src={logo} alt="logo" />
            {/* <h1>Chef ChatGPT</h1> */}
            <h1>鸡皮提大厨</h1>
        </header>
    );
}
