import "./GetRecipeContainer.css";
export default function GetRecipeContainer(props) {
    return (
        <div className="get-recipe-container">
            <div className="get-recipe-container-inner" ref={props.ref}>
                <h3>准备好了吗？</h3>
                <p>让鸡皮提大厨来帮你生成菜谱吧！</p>
                <p>(最好三样以上食材，否则得到的菜谱效果不够好哦！)</p>
            </div>
            <button onClick={props.toggleGetRecipe}>
                {props.getRecipe > 0 ? "换一个" : "生成菜谱"}
            </button>
        </div>
    );
}
