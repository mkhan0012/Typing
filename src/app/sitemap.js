export default function sitemap() {
    const baseUrl = 'https://monotype-typing.vercel.app'; // REPLACE with your URL
  
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      // Add other pages here if you create them (e.g., /leaderboard)
    ];
  }