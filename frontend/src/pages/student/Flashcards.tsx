import { StudentLayout } from '../../components/layout';
import { Card, Button, Badge } from '../../components/ui';
import { Plus, Layers, RotateCcw } from 'lucide-react';

export function Flashcards() {
  const mockDecks = [
    {
      id: '1',
      title: 'Database Normalization',
      cardCount: 15,
      cardsToReview: 8,
      masteredCards: 3,
      lastReviewedAt: '2024-09-17T10:00:00Z',
    },
    {
      id: '2',
      title: 'Operating Systems Concepts',
      cardCount: 20,
      cardsToReview: 12,
      masteredCards: 5,
      lastReviewedAt: '2024-09-16T14:00:00Z',
    },
    {
      id: '3',
      title: 'Data Structures',
      cardCount: 25,
      cardsToReview: 25,
      masteredCards: 0,
      lastReviewedAt: null,
    },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-headline-lg text-on-surface">Flashcards</h1>
            <p className="text-body-md text-on-surface-variant">
              Spaced repetition flashcards generated from your materials
            </p>
          </div>
          <Button>
            <Plus size={18} />
            Generate Deck
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-label-sm text-outline uppercase tracking-wider mb-1">Total Decks</p>
            <p className="text-headline-lg font-bold text-on-surface">3</p>
          </Card>
          <Card>
            <p className="text-label-sm text-outline uppercase tracking-wider mb-1">Total Cards</p>
            <p className="text-headline-lg font-bold text-primary">60</p>
          </Card>
          <Card>
            <p className="text-label-sm text-outline uppercase tracking-wider mb-1">To Review</p>
            <p className="text-headline-lg font-bold text-tertiary">45</p>
          </Card>
          <Card>
            <p className="text-label-sm text-outline uppercase tracking-wider mb-1">Mastered</p>
            <p className="text-headline-lg font-bold text-secondary">8</p>
          </Card>
        </div>

        {/* Decks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockDecks.map((deck) => (
            <Card key={deck.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-container/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Layers className="text-primary" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-headline-md text-on-surface mb-1">{deck.title}</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    {deck.cardCount} cards total
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">To Review</span>
                  <Badge variant="warning">{deck.cardsToReview} cards</Badge>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Mastered</span>
                  <Badge variant="success">{deck.masteredCards} cards</Badge>
                </div>
              </div>

              {/* Last Reviewed */}
              {deck.lastReviewedAt && (
                <p className="text-body-sm text-on-surface-variant mb-4">
                  Last reviewed {formatTimeAgo(deck.lastReviewedAt)}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {deck.cardsToReview > 0 ? (
                  <Button className="flex-1">
                    <RotateCcw size={18} />
                    Review ({deck.cardsToReview})
                  </Button>
                ) : (
                  <Button variant="outline" className="flex-1" disabled>
                    All Reviewed ✓
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* How it Works */}
        <Card variant="outlined" className="bg-surface-container-low">
          <h3 className="font-headline-md text-on-surface mb-3">How Spaced Repetition Works</h3>
          <div className="space-y-2 text-body-sm text-on-surface-variant">
            <p>• <strong>Again:</strong> Card appears again today (forgot)</p>
            <p>• <strong>Hard:</strong> Card appears tomorrow (difficult)</p>
            <p>• <strong>Good:</strong> Card appears in 3 days (remembered)</p>
            <p>• <strong>Easy:</strong> Card appears in 7 days (mastered)</p>
          </div>
        </Card>

        {/* Generate Deck CTA */}
        <Card variant="outlined" className="bg-gradient-to-br from-primary-container/10 to-secondary-container/10 border-primary-container/30">
          <div className="text-center py-6">
            <h3 className="font-headline-md text-on-surface mb-2">Create a New Deck</h3>
            <p className="text-body-md text-on-surface-variant mb-4">
              Generate flashcards from your documents or choose a specific topic
            </p>
            <Button>
              <Plus size={18} />
              Generate Flashcards
            </Button>
          </div>
        </Card>
      </div>
    </StudentLayout>
  );
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
