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
       Typh (born May 8th), formerly known as Typhsketch, is an American artist and animator. 
      </h1>
    </div>
  )
}
