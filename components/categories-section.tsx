import Image from "next/image"

const categories = [
  {
    title: "Danseurs & Groupes",
    subtitle: "Moderne & Traditionnel",
    image: "/images/category-dance.jpg",
  },
  {
    title: "Artistes Chanteurs",
    subtitle: "Solo & Performance",
    image: "/images/category-singer.jpg",
  },
  {
    title: "Stylistes & Mode",
    subtitle: "Haute Couture & Design",
    image: "/images/category-fashion.jpg",
  },
  {
    title: "Com\u00e9diens & Th\u00e9\u00e2tre",
    subtitle: "Sc\u00e8ne & Expression",
    image: "/images/category-theatre.jpg",
  },
  {
    title: "Slameurs",
    subtitle: "Po\u00e9sie & Slam",
    image: "/images/category-slam.jpg",
  },
  {
    title: "Artistes Plasticiens",
    subtitle: "Arts Visuels & Cr\u00e9ation",
    image: "/images/category-art.jpg",
  },
]

export function CategoriesSection() {
  return (
    <section id="categories" className="py-20 lg:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-4">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Disciplines</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              {"Cat\u00e9gories d'Artistes"}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md leading-relaxed text-sm">
            {"Une s\u00e9lection rigoureuse pour garantir l'excellence et la diversit\u00e9 de notre programme artistique."}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-foreground font-bold text-sm leading-tight">{cat.title}</h3>
                <p className="text-primary text-xs mt-1">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
