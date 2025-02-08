import "./Ingredient.css";

export default function Ingredient(props) {
    return (
        <div className="ingredient-item">
            <p>{props.ingredient}</p>
            <button onClick={() => props.handleDelete(props.ingredient)}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
}
