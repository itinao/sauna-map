"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  openSaunnerMapAction,
  type OpenSaunnerMapState,
} from "../actions";

const INITIAL_STATE: OpenSaunnerMapState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-wait disabled:bg-blue-400 sm:w-40"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin"
          />
          <span>集計中</span>
        </>
      ) : (
        "マップを開く"
      )}
    </button>
  );
}

export function OpenSaunnerMapForm() {
  const [state, action] = useActionState(openSaunnerMapAction, INITIAL_STATE);

  return (
    <form action={action} className="space-y-3">
      <label
        className="block text-sm font-medium text-slate-700"
        htmlFor="saunnerInput"
      >
        サウナイキタイURL または ID
      </label>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
        <input
          className="min-h-12 w-full min-w-0 rounded border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          id="saunnerInput"
          name="saunnerInput"
          placeholder="URL または ID"
          required
          type="text"
        />
        <SubmitButton />
      </div>
      <p className="text-xs leading-5 text-slate-500">
        例: https://sauna-ikitai.com/saunners/136461、136461、スマホアプリの共有テキスト
      </p>
      {state.error ? (
        <p className="text-sm font-medium text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}
