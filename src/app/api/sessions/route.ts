import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { UserScores, Answer } from '@/types';

interface RequestBody {
  scores: UserScores;
  personaId: string;
  answers: Answer[];
}

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();
  const { scores, personaId, answers } = body;

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      social_distance: scores.social_distance,
      rationality:     scores.rationality,
      obedience:       scores.obedience,
      chaos:           scores.chaos,
      persona_id:      personaId,
    })
    .select('id')
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: sessionError?.message }, { status: 500 });
  }

  const { error: answersError } = await supabase
    .from('answers')
    .insert(
      answers.map((a) => ({
        session_id:           session.id,
        scenario_id:          a.scenarioId,
        choice_id:            a.choiceId,
        target_urinal_index:  a.targetUrinalIndex ?? null,
      })),
    );

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
