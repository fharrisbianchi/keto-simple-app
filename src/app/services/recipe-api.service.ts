import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { recipeData } from '../mocks/service.mock';


@Injectable({
  providedIn: 'root'
})
export class RecipeApiService {
  private apiUrl = 'https://low-carb-recipes.p.rapidapi.com/search';
  private apiKey = environment.apiKey; // Replace with your API key
  private recipeData = recipeData; // Assign the imported recipeData directly

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getData(): Promise<any> {
    const url = `${this.apiUrl}?name=cake&tags=keto%3Bdairy-free&maxCalories=500&maxNetCarbs=5&maxSugar=3&maxAddedSugar=0&limit=10`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '41c3518094mshd47c9a3fda33153p1f1656jsnd11aa86c7d2a',
        'X-RapidAPI-Host': 'low-carb-recipes.p.rapidapi.com'
      }
    };

    // Delete the ! in response.ok to get real data from service
      try {
      const response = await fetch(url, options);
      if (!response.ok) {
          return await response.json();
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error(error);
      return this.recipeData;
    }
  }
}
