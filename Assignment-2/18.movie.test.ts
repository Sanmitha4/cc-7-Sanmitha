import { describe, it, expect, assert } from 'vitest';
import { getAllActors, getMoviesByYearLimited, Movie } from './18.movie';

import mockMovies from './movies.json';
describe('Movies Data Transformations', () => {

  describe('getAllActors', () => {
    it('should return a unique list of actors from the full dataset', () => {
      const actors = getAllActors(mockMovies);
      
      assert.include(actors, "Jason Sudeikis");
      assert.include(actors, "Anya Taylor-Joy");
      assert.include(actors, "Vin Diesel");
      
      
      expect(actors).toHaveLength(2014);
      
      const uniqueCheck = new Set(actors);
      expect(actors.length).toBe(uniqueCheck.size);
    });

    it('should handle movies with no cast members correctly', () => {
      const emptyCastMovie: Movie[] = [{ title: "Silent", year: 2020, cast: [], genres: [] }];
      assert.deepEqual(getAllActors(emptyCastMovie), []);
    });
  });

  describe('getMoviesByYearLimited', () => {
    it('should group movie titles by year', () => {
      const result = getMoviesByYearLimited(mockMovies);
      
      // Check that the years 2017 and 2018 exist as keys
      assert.property(result, "2017");
      assert.property(result, "2018");
      assert.isArray(result["2017"]);
    });

    it('should limit the number of movies per year to a maximum of 3', () => {
      const result = getMoviesByYearLimited(mockMovies);
      
      expect(result["2017"]).toHaveLength(3);
      
      expect(result["2017"]).toEqual([
        "The Book of Love", 
        "Split", 
        "xXx: Return of Xander Cage"
      ]);

      assert.notInclude(result["2017"], "The Resurrection of Gavin Stone");
    });

    it('should maintain keys as strings', () => {
        const result = getMoviesByYearLimited(mockMovies);
        Object.keys(result).forEach(year => {
            assert.isString(year);
        });
    });
  });
});