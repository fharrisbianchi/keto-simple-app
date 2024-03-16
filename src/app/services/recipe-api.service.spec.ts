import { TestBed } from '@angular/core/testing';
import { RecipeApiService } from './recipe-api.service';

describe('RecipeApiService', () => {
  let service: RecipeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeApiService]
    });
    service = TestBed.inject(RecipeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch recipe data successfully', async () => {
    const data = await service.getData();
    expect(data).toBeDefined();
  });

});
