import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['Assignment-3/*.test.ts'],   
    exclude: ['Assignment-3/post-browser/**'] 
  }
})