"use client";

import { useFormStatus } from "react-dom";
import { scrapeSaunnerAction } from "../actions";

type ScrapeSaunnerFormProps = {
  disabled?: boolean;
  idleLabel?: string;
  saunnerId: string;
};

type SubmitButtonProps = {
  disabled: boolean;
  idleLabel: string;
};

function SubmitButton({ disabled, idleLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-wait disabled:bg-blue-400 sm:w-auto"
      disabled={isDisabled}
      type="submit"
    >
      {isDisabled ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin"
          />
          <span>集計中</span>
        </>
      ) : (
        idleLabel
      )}
    </button>
  );
}

export function ScrapeSaunnerForm({
  disabled = false,
  idleLabel = "スクレイピングを開始",
  saunnerId,
}: ScrapeSaunnerFormProps) {
  const action = scrapeSaunnerAction.bind(null, saunnerId);

  return (
    <form action={action}>
      <SubmitButton disabled={disabled} idleLabel={idleLabel} />
    </form>
  );
}
