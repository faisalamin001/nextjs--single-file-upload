"use client"
import { ChangeEvent, useState, useEffect, useRef } from "react"
import Image from "next/image"

interface Img {
  src: string
}

const FileUploader: React.FC<{}> = () => {
  const [img, setImg] = useState<Img | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setLoading(true)

      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        if (reader.result) {
          let currentProgress = 0
          const interval = setInterval(() => {
            currentProgress += 10
            setProgress(currentProgress)

            if (currentProgress === 100) {
              clearInterval(interval)
              setImg({ src: reader?.result?.toString() || "" })
              setLoading(false)
              setIsImageUploaded(true)
            }
          }, 200)
        }
      }

      reader.onerror = () => {
        console.log(reader.error)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    setProgress(0)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-black rounded-xl p-8 w-full max-w-md text-center  border-2 border-yellow-600">
        <h1 className="text-3xl font-bold mb-4 text-solid text-yellow-600  ">
          Choose an Image
        </h1>

        <button className="btn " onClick={() => inputRef.current?.click()}>
          {isImageUploaded ? "Upload Another Image" : "Upload Image"}
        </button>
        <input
          ref={inputRef}
          onChange={onChange}
          type="file"
          name="file"
          className="mb-4"
          style={{ display: "none" }}
        />

        {loading && (
          <div className="mt-4">
            <div
              className="radial-progress bg-yellow-600 text-primary-content border-4 border-yellow-600 mx-auto"
              style={{ "--value": progress }}
              role="progressbar"
            >
              {progress}%
            </div>
          </div>
        )}

        {img && !loading && (
          <div className="mt-4">
            <h2 className="text-xl text-yellow-600 font-bold mb-4">
              Image chosen:
            </h2>
            <Image
              src={img.src}
              width={300}
              height={400}
              alt="Image chosen"
              className=" w-28 h-28 object-cover mb-4 mx-auto rounded-full"
            />
          </div>
        )}

        {img && !loading && (
          <div className="mt-4">
            <h2 className="text-3xl text-yellow-600 font-bold mb-4">Result</h2>
            <p className="text-gray-500">Your result text goes here...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUploader
