import { useEffect, useState } from "react"

{/* Verwendung:
    
#
<RatingBasic rating={4.2} totalRatings={88} title="Bewertungen" />
#
<RatingBasic apiEndpoint="http://localhost:3000/api/ratings" id={42} />

*/}

interface RatingBasicProps {
  title?: string
  rating?: number
  maxRating?: number
  totalRatings?: number
  apiEndpoint?: string
  id?: number | string
}

export default function RatingBasic({
  title = "Customer reviews",
  rating: initialRating = 0,
  maxRating = 5,
  totalRatings: initialTotal = 0,
  apiEndpoint,
  id,
}: RatingBasicProps) {
  const [rating, setRating] = useState(initialRating)
  const [totalRatings, setTotalRatings] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiEndpoint) return
    
    const fetchRating = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = id ? `${apiEndpoint}/${id}` : apiEndpoint
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}: Fehler beim Laden der Bewertung`)
        const data = await res.json()
        
        // validate response structure
        if (typeof data.rating !== "number" || typeof data.totalRatings !== "number") {
          throw new Error("Ungültiges Antwortformat vom Server")
        }
        
        setRating(data.rating)
        setTotalRatings(data.totalRatings)
      } catch (err) {
        setError((err as Error).message || "Bewertung konnte nicht geladen werden.")
        // revert to initial values on error
        setRating(initialRating)
        setTotalRatings(initialTotal)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRating()
  }, [apiEndpoint, id, initialRating, initialTotal])

  if (loading) return <div className="text-slate-400 text-sm">Lade Bewertung…</div>
  if (error) return <div className="text-red-500 text-sm">{error}</div>

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= maxRating; i++) {
      const fillPercent = Math.min(Math.max(rating - (i - 1), 0), 1) * 100
      stars.push(
        <div key={i} className="relative h-6 w-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="absolute inset-0 h-6 w-6 text-amber-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${fillPercent}%` }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-amber-400"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )
    }
    return stars
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <h4 className="font-bold text-slate-700">{title}</h4>
      <span className="flex items-center gap-4 text-sm text-slate-500">
        <span className="flex gap-1">{renderStars()}</span>
        <span>{rating.toFixed(1)} / {maxRating}</span>
      </span>
      <span className="text-xs leading-6 text-slate-400">
        based on {totalRatings} user ratings
      </span>
    </div>
  )
}
