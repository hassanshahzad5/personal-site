import type { Metadata } from 'next';
import DesignClient from './DesignClient';

export const metadata: Metadata = {
  title: 'Design - Hassan Shahzad',
  description: 'Visual storytelling, brand building, and marketing. Design portfolio featuring professional branding, academic typography projects, and personal creative work.',
  openGraph: {
    title: 'Design - Hassan Shahzad',
    description: 'Visual storytelling, brand building, and marketing. Design portfolio featuring professional branding, academic typography projects, and personal creative work.',
    url: 'https://hassanshahzad.me/design',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design - Hassan Shahzad',
    description: 'Visual storytelling, brand building, and marketing. Design portfolio featuring professional branding, academic typography projects, and personal creative work.',
  },
};

export default function Design() {
  return <DesignClient />;
}
