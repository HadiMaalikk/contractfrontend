import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type DiffBlock = {
  type: 'add' | 'remove' | 'edit' | 'same';
  leftText?: string;
  rightText?: string;
  comment?: string;
};

export default function ComparisonViewer() {
  const [leftContent, setLeftContent] = useState<string[]>([]);
  const [rightContent, setRightContent] = useState<string[]>([]);
  const [diffs, setDiffs] = useState<DiffBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiffResult(): Promise<DiffBlock[]> {
      setLoading(true);
      const mockResult: DiffBlock[] = [
        { type: 'same', leftText: 'Overview of LangChain Framework', rightText: 'Overview of LangChain Framework' },
        { type: 'edit', leftText: 'Core Features', rightText: 'Key Features', comment: 'Heading changed' },
        { type: 'add', rightText: 'New innovative guide section', comment: 'New section added' },
        { type: 'remove', leftText: 'Legacy deployment details', comment: 'Removed deprecated content' },
      ];
      setLeftContent(mockResult.map(d => d.leftText || ''));
      setRightContent(mockResult.map(d => d.rightText || ''));
      setDiffs(mockResult);
      setLoading(false);
      return mockResult;
    }

    fetchDiffResult();
  }, []);

  const highlightClass = (type: DiffBlock['type']) => {
    switch (type) {
      case 'add': return 'bg-green-100 text-green-800';
      case 'remove': return 'bg-red-100 text-red-800';
      case 'edit': return 'bg-yellow-100 text-yellow-800';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <header className="flex items-center justify-between mb-6" role="banner">
        <Link to="/" className="text-3xl font-bold text-orange-500">Verdicto</Link>
        <span className="text-sm text-gray-600">Contract Comparison Viewer</span>
      </header>

      {loading ? (
        <div className="text-center text-gray-600">Loading comparison...</div>
      ) : diffs.length === 0 ? (
        <div className="text-center text-gray-500">No differences detected.</div>
      ) : (
        <main className="grid grid-cols-1 md:grid-cols-3 gap-4" role="main">
          {/* Left Document */}
          <section className="border rounded p-4 overflow-auto max-h-[80vh] col-span-1 bg-gray-50" aria-label="Old Version">
            <h2 className="text-lg font-semibold mb-2 text-center text-orange-600">Old Version</h2>
            {diffs.map((block, index) => (
              <div key={index} className={`p-2 my-1 rounded ${highlightClass(block.type)}`}>
                {block.leftText || <span className="text-gray-400 italic">No content</span>}
              </div>
            ))}
          </section>

          {/* Right Document */}
          <section className="border rounded p-4 overflow-auto max-h-[80vh] col-span-1 bg-gray-50" aria-label="New Version">
            <h2 className="text-lg font-semibold mb-2 text-center text-orange-600">New Version</h2>
            {diffs.map((block, index) => (
              <div key={index} className={`p-2 my-1 rounded ${highlightClass(block.type)}`}>
                {block.rightText || <span className="text-gray-400 italic">No content</span>}
              </div>
            ))}
          </section>

          {/* Summary Panel */}
          <aside className="border rounded p-4 bg-gray-100 col-span-1 max-h-[80vh] overflow-auto" aria-label="Comparison Summary">
            <h2 className="text-lg font-semibold mb-4 text-center text-purple-600">Comparison Summary</h2>

            <div className="text-sm text-gray-700 mb-4 text-center">
              ➕ {diffs.filter(d => d.type === 'add').length} additions | ✏️ {diffs.filter(d => d.type === 'edit').length} edits | ❌ {diffs.filter(d => d.type === 'remove').length} removals
            </div>

            {diffs.filter(d => d.type !== 'same').map((block, index) => (
              <div key={index} className={`mb-3 p-2 rounded ${highlightClass(block.type)}`}>
                <p className="text-sm font-medium capitalize">{block.type}:</p>
                <p className="text-xs text-gray-700">{block.comment || 'Change detected'}</p>
              </div>
            ))}
          </aside>
        </main>
      )}
    </div>
  );
}
