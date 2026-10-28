import Link from "next/link";
import type { CSSProperties } from "react";
import { lineCodes, lineColors } from "../utils/metro-lines";

export default function Home() {
  return (
    <main className="page">
      <h1 className="page-title">Línies</h1>
      <nav aria-label="Línies de metro">
        <ul className="line-list">
          {lineCodes.map((line) => (
            <li key={line}>
              <Link className="line-link" href={`/line/${line}`}>
                <span className="line-code" style={{ "--line-color": lineColors[line] } as CSSProperties}>{line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
