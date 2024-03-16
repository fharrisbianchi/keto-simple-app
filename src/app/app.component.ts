import { Component, OnInit } from '@angular/core';
import { RecipeApiService } from './services/recipe-api.service';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Recipe } from './interfaces/interfaces';
import { recipeData } from '../app/mocks/service.mock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  isLoading = false;
  localStorageKey = 'recipesData'; // Fix missing closing quote
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] = [];
  isMobile: boolean = false;
  recipeForm: Recipe | undefined;

  constructor(private recipeApiService: RecipeApiService, private http: HttpClient, private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      Breakpoints.Handset, // Screen to 599px
      Breakpoints.Small,   // Mobile
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit() {
    const storedData = localStorage.getItem(this.localStorageKey);
    if (storedData) {
      this.data = JSON.parse(storedData);
    } else {
      this.getRecipesData();
    }
  }

  async getRecipesData() {
    try {
      this.isLoading = true;
      //uncomment this to avoid the error bandwith service
      //const response = await this.recipeApiService.getData();
      this.data = recipeData;
      // Save data in localstorage
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error fetching recipe data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleEditServings(recipe: Recipe) {
    recipe.isEditingServings = !recipe.isEditingServings;
  }

  editRecipe(recipe: Recipe): void {
    const storedData = localStorage.getItem(this.localStorageKey);
    if (storedData) {
      const recipes: Recipe[] = JSON.parse(storedData);
      const index = recipes.findIndex(r => r.name === recipe.name);
      if (index !== -1) {
        recipes[index] = recipe;
        recipe.isEditingServings = false;
        localStorage.setItem(this.localStorageKey, JSON.stringify(recipes));
      }
    }
  }

  createRecipe(name: string, description: string, prepareTime: string, cookTime: string, servings: string): void {
    // Parse prepareTime, cookTime, and servings as numbers
    const parsedPrepareTime = parseInt(prepareTime, 10);
    const parsedCookTime = parseInt(cookTime, 10);
    const parsedServings = parseInt(servings, 10);

    // Check if parsing was successful
    if (isNaN(parsedPrepareTime) || isNaN(parsedCookTime) || isNaN(parsedServings)) {
      console.error('Invalid input for prepareTime, cookTime, or servings.');
      return;
    }

    // Create a new recipe object
    const newRecipe = {
      name: name,
      description: description,
      prepareTime: parsedPrepareTime,
      cookTime: parsedCookTime,
      servings: parsedServings,
      ingredients: [],
      image: 'https://rapidapi.com/blog/wp-content/uploads/2021/08/recipe-api-768x500.jpg'
    };

    // Add the new recipe to the data array
    this.data.push(newRecipe);

    // Update the localStorage with the updated data array
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
  }

  tooltipStates: { [key: string]: boolean } = {};

  toggleTooltip(recipeId: string): void {
    this.tooltipStates[recipeId] = !this.tooltipStates[recipeId];
  }

  deleteRecipe(recipe: Recipe): void {
    const index = this.data.indexOf(recipe);
    if (index !== -1) {
      this.data.splice(index, 1);
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
    }
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
}
