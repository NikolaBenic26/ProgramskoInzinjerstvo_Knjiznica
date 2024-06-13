const fetchBooks = async () => {
    const response = await fetch('/knjige');
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return response.json();
  };
  
  export { fetchBooks };
  