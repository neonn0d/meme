import { redirect } from 'next/navigation';

export default function TelegramRedirect() {
  redirect('/telegram/dashboard');
}
