import { scrapeSaunnerAction } from "../actions";

type ScrapeSaunnerFormProps = {
  saunnerId: string;
};

export function ScrapeSaunnerForm({ saunnerId }: ScrapeSaunnerFormProps) {
  const action = scrapeSaunnerAction.bind(null, saunnerId);

  return (
    <form action={action}>
      <button
        className="h-11 rounded bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        type="submit"
      >
        スクレイピングを開始
      </button>
    </form>
  );
}
