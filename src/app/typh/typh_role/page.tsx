const getData = async () =>
{ 
return new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("date")
  }, 2000)
})
}

export default async function Home() {
  const data = await getData()
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello typh!
      </h1>
    </div>
  )
}