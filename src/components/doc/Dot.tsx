/**
 * The middle dot between the items of a run-in list: links in an author line,
 * fields of a meta line.
 *
 * The space before it does not break and the one after it does, so a long
 * list wraps between items and a line never starts with a dot. Spacing the
 * dot with margins instead leaves the list without a single break opportunity,
 * and on a phone it runs off the side of the screen.
 */
export function Dot({ className = "text-faint" }: { className?: string }) {
  return (
    <>
      <span aria-hidden="true" className={className}>
        {" ·"}
      </span>{" "}
    </>
  );
}
