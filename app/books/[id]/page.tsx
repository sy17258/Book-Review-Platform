
import { mockBooks } from '@/lib/api';
import BookDetail from './BookDetail';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ];
}

export default function BookPage({ params }: { params: { id: string } }) {
  return <BookDetail bookId={params.id} />;
}
