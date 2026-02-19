export interface Movie {
  title: string;
  year: number;
  cast: string[];
  genres: string[];
}

/**
 * Extracts a unique list of all actor names from the movie dataset.
 */
export const getAllActors = (data: Movie[]): string[] => {
  return data
    .reduce((acc: string[], movie) => acc.concat(movie.cast), [])
    .filter((actor, index, self) => self.indexOf(actor) === index);
};

/**
 * Groups movies by year, limited to 3 titles per year.
 */
export const getMoviesByYearLimited = (data: Movie[]): Record<string, string[]> => {
  return data.reduce((acc: Record<string, string[]>, movie) => {
    const year = movie.year.toString();
    const existingMovies = acc[year] || [];
    if (existingMovies.length < 3) {
      acc[year] = [...existingMovies, movie.title];
    }
    return acc;
  }, {});
};