import "./Main.css";
import { useState, useRef, useEffect } from "react";
import Ingredient from "../Ingredient/Ingredient";
import Recipe from "../Recipe/Recipe";
import GetRecipeContainer from "../GetRecipeContainer/GetRecipeContainer";
import { BoxLoading } from "react-loadingg";
// import { getRecipeFromZephyr } from "../../ai";
// import { getRecipeFromDeepSeekNVDA } from "../../ai";
import { getRecipeFromDeepSeek } from "../../ai";

export default function Main() {
    const [ingredients, setIngredients] = useState({});
    const [getRecipe, setGetRecipe] = useState(0);
    const [recipeContent, setRecipeContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const recipeSection = useRef(null);
    console.log(recipeSection);

    // auto scroll to result smoothly
    useEffect(() => {
        if (recipeSection !== null && recipeContent !== "") {
            recipeSection.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [recipeContent]);

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient");
        setIngredients((ingredients) => ({
            ...ingredients,
            [newIngredient]: ingredients[newIngredient] ? ingredients[newIngredient] + 1 : 1,
        }));
    }

    // delete a kind of ingredient
    function deleteIngredient(ingredient) {
        setIngredients((ingredients) => {
            const newIngredients = { ...ingredients };
            delete newIngredients[ingredient];
            return newIngredients;
        });
    }

    async function toggleGetRecipe() {
        setIsLoading(true);
        setGetRecipe((getRecipe) => getRecipe + 1);
        try {
            const recipeMarkdown = await getRecipeFromDeepSeek(ingredients);
            setRecipeContent(recipeMarkdown);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredients-form">
                <input
                    type="text"
                    placeholder="例如：西红柿🍅 ➕ 鸡蛋🥚"
                    aria-label="请添加食材"
                    name="ingredient"
                    required
                />
                <button>添加食材</button>
            </form>

            {Object.keys(ingredients).length > 0 && (
                <section>
                    <h2>你的食材</h2>
                    <div className="ingredients-list">
                        {Object.keys(ingredients)
                            .filter((ingredient) => ingredients[ingredient] > 0)
                            .map((ingredient) => (
                                <Ingredient
                                    key={ingredient}
                                    ingredient={ingredient}
                                    handleDelete={deleteIngredient}
                                />
                            ))}
                    </div>

                    <GetRecipeContainer
                        getRecipe={getRecipe}
                        toggleGetRecipe={toggleGetRecipe}
                        ref={recipeSection}
                    />
                </section>
            )}

            {isLoading ? (
                <BoxLoading />
            ) : (
                Object.keys(ingredients).length > 0 &&
                getRecipe > 0 && <Recipe recipeContent={recipeContent} />
            )}
        </main>
    );
}
