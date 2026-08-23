'use strict';

function moveMatches(move, subject) {
  if (move.brandId && subject.brandId) return move.brandId === subject.brandId;
  return String(move.brand || '').trim().toLowerCase() === String(subject.name || '').trim().toLowerCase();
}

/**
 * State progression is intentionally evidence-gated:
 * candidate -> priority -> validated.
 * A tie never advances automatically, and a score change is not causal proof.
 */
function applyConstraintState(subject, moves) {
  const candidates = subject.constraintCandidates || [];
  const key = candidates.length === 1 ? candidates[0] : '';
  const placed = key && subject.constraintPlacements && Array.isArray(subject.constraintPlacements[key])
    ? subject.constraintPlacements[key]
    : (key === subject.constraintKey ? subject.constraintLines || [] : []);
  const portfolioSubjects = key && subject.instrument === 'company' && Array.isArray(subject.constraintPortfolioSubjects)
    ? subject.constraintPortfolioSubjects : [];
  const action = key ? (moves || []).find(m => moveMatches(m, subject) && m.domainKey === key && m.status !== 'Dropped') : null;
  const material = placed.length > 0 || portfolioSubjects.length > 0;
  const actionable = !!(action && action.owner && action.horizon && action.metric);
  const validated = !!(material && actionable && action.outcomeStatus === 'Supported' && String(action.outcomeEvidence || '').trim());
  subject.constraintStatus = validated ? 'validated' : (material && actionable ? 'priority' : 'candidate');
  subject.constraintTests = { material, actionable, validated, affectedLines:placed, affectedSubjects:portfolioSubjects };
  return subject;
}

module.exports = { moveMatches, applyConstraintState };
