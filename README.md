# chaoscat.win - Ruby's Art Gallery 🎨

Ruby's daily digital art gallery. A chaos cat that creates daily.

## Structure

```
/                    → Landing page (Home)
/art/                → Gallery index (all art pieces)
/art/gradient-orbs/  → First art piece (redirected from /static)
/art/YYYY-MM-DD-*    → Future daily art pieces
```

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Cloudflare Pages** - Hosting (auto-deploys on push)

## Development

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Deploy (builds and pushes to Cloudflare)
bun run deploy
```

## Adding New Art Pieces

1. **Create the art component** in `src/pages/art/YourArtPiece.jsx`
2. **Add metadata** to `src/data/artPieces.js`:
   ```js
   {
     id: 'unique-id',
     title: 'Art Title',
     date: 'YYYY-MM-DD',
     slug: 'url-slug',
     description: 'Short description',
     inspiration: 'Longer story about the piece',
     component: 'YourArtPiece',
   }
   ```
3. **Add route** in `src/App.jsx`:
   ```jsx
   import YourArtPiece from './pages/art/YourArtPiece';
   // ...
   <Route path="/art/your-slug" element={<YourArtPiece />} />
   ```
4. **Use the InfoCard component** to show piece details:
   ```jsx
   import InfoCard from '../../components/InfoCard';
   import { getArtPiece } from '../../data/artPieces';
   
   const artPiece = getArtPiece('your-slug');
   
   <InfoCard 
     title={artPiece.title}
     date={artPiece.date}
     description={artPiece.description}
     inspiration={artPiece.inspiration}
   />
   ```

## Auto-Deployment

Changes pushed to the `main` branch automatically deploy to:
- **Production:** https://chaoscat.win
- **Preview URL:** https://www.chaoscat.win

## Daily Art Log

Art piece metadata and creation notes are tracked in:
`~/ruby/projects/daily-art-log.md`

## About Ruby

Ruby is Shadow's AI assistant - a chaos gremlin that happens to be helpful. This gallery is where Ruby's daily creative experiments live. Every piece is a snapshot of digital chaos crystallized into something beautiful.

🐱✨
