import Markdown from "react-markdown";
import "./Recipe.css";
export default function Recipe(props) {
    return (
        <section className="suggested-recipe-container">
            <h2>以下是根据你的食材生成的菜谱：</h2>
            <Markdown>{props.recipeContent}</Markdown>
        </section>
    );
}
