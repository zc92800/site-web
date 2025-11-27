const API_KEY = "19ab624af4804c2889e92db3aac19794";

 

async function searchAPI() {

    const query = document.getElementById("searchInput").value.trim();

    const resultsBox = document.getElementById("results");

    if (!query) {

        resultsBox.innerHTML = "<p>Veuillez entrer un mot-clé.</p>";


        return;

    }

    resultsBox.innerHTML = "<p>Recherche en cours...</p>";

    try {
        const response = await fetch(


            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&number=10`


        );

        const data = await response.json();


        if (!data.results || data.results.length === 0) {

            resultsBox.innerHTML = "<p>Aucune recette trouvée.</p>";

            return;
        }
        resultsBox.innerHTML = data.results.map(recipe => `


            <div class="recipe-card" java-script="loadRecipe(${recipe.id})">

                <h3>${recipe.title}</h3>

                <img data-class='loading' data-src="${recipe.image}" alt="${recipe.title}">

            </div>


        `).join("");

    } catch (err) {

        console.error(err);

        resultsBox.innerHTML = "<p>Une erreur est survenue.</p>";

    }


}

 

async function loadRecipe(id) {

    const resultsBox = document.getElementById("results");

    resultsBox.innerHTML = "<p>Chargement de la recette...</p>";

    try {


        const response = await fetch(


            `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`

        );

        const recipe = await response.json();

        resultsBox.innerHTML = `

            <div class="recipe-details">

                <h2>${recipe.title}</h2>

                <img data-class='loading' data-src="${recipe.image}" style="width:300px; border-radius:10px; display:block; margin:auto;">

                <h3>Ingrédients :</h3>
                <ul>
                    ${recipe.extendedIngredients
                        .map(ing => `<li>${ing.original}</li>`)
                        .join("")}
                </ul>

                <h3>Instructions :</h3>

                <p>${recipe.instructions || "Aucune instruction disponible."}</p>
                <button java-script="searchAPI()" class="back-btn">⬅ Retour</button>
            </div>
        `;
    } catch (err) }