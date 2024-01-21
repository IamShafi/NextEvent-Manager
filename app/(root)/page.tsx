import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import HeaderLottie from "@/components/shared/HeaderLottie";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import choose1png from '/public/why-choose-01.png'
import choose2png from '/public/why-choose-02.png'
import chooseMiddle from '/public/why-choose-big.png'
import chooseMiddle2 from '/public/why-choose-big2.png'


export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  });

  const brands = [
    {
      src: "/shared/desktop/tesla.svg",
      alt: "Tesla",
      width: 129,
      height: 17,
      styles: "md:justify-self-start filter-white",
    },
    {
      src: "/shared/desktop/microsoft.svg",
      alt: "Microsoft",
      width: 145,
      height: 31,
      styles: "md:justify-self-center md:mr-[0.5625rem] filter-white",
    },
    {
      src: "/shared/desktop/hewlett-packard.svg",
      alt: "Hewlett Packard",
      width: 140,
      height: 27,
      styles: "md:justify-self-end filter-white",
    },
    {
      src: "/shared/desktop/oracle.svg",
      alt: "Oracle",
      width: 131,
      height: 17,
      styles: "md:justify-self-start filter-white",
    },
    {
      src: "/shared/desktop/google.svg",
      alt: "Google",
      width: 96,
      height: 33,
      styles: "md:justify-self-center md:mr-[0.5625rem] filter-white",
    },
    {
      src: "/shared/desktop/nvidia.svg",
      alt: "Nvidia",
      width: 137,
      height: 26,
      styles: "md:justify-self-end filter-white",
    },
  ];

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Elevate your events with our platform: Host, Connect, and
              Celebrate! !
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Trusted by thousands of events worldwide.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
              {/* <ContactForm /> */}
            </Button>
          </div>
          {/* right hero section */}
          {/* <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          /> */}
          {/* <Lottie animationData={animationData}  /> */}
          <HeaderLottie />
        </div>
      </section>
      {/* about */}
      <section
        className=" 
      circle-second relative z-10 overflow-hidden bg-dark-gunmetal py-[4.25rem] text-police-blue "
      >
        <div
          className="
      wrapper 
      grid max-w-7xl gap-[2.5625rem] pl-[1.125rem] text-white lg:grid-cols-2"
        >
          <div className="text-align order-1 flex flex-col items-center lg:order-none lg:items-start">
            <h2 className="subtitle font-serif">Who we work with</h2>
            <p
              className="
          content | 
          mb-[2rem] mt-[1.5rem] max-w-[27.8125rem] text-ghost-white opacity-70"
            >
              {/* eslint-disable-next-line max-len */}
              We take pride in serving a wide spectrum of clients, ranging from
              small businesses to large corporations, non-profit organizations
              to individual event planners. Each client is unique, and we tailor
              our solutions to meet their specific needs, ensuring that every
              event is a reflection of their vision and goals.
            </p>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link
              href="/"
              className="p-btn-aux controller controller-white block"
            >
              About Us
            </Link>
          </div>
          {/* <Brands imageColor="filter-white" /> */}
          <div className="grid grid-cols-2 content-center items-center justify-center gap-x-[1.875rem] gap-y-[2.4375rem] md:grid-cols-3">
            {brands.map((brand) => (
              <Image
                key={brand.alt}
                src={brand.src}
                alt={brand.alt}
                width={brand.width}
                height={brand.height}
                className={brand.styles}
              />
            ))}
          </div>
        </div>
      </section>

      {/* why choose us */}
      <section className="wrapper my-8 flex flex-col gap-8">
      <div className="bd-section__title-wrapper text-center mb-8">
        <span className="subtitle font-serif text-lime-400">Why Choose Us</span>
        <h2 className="font-bold choose-title">6 reasons to Choose us</h2>
      </div>
      {/* items */}
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3">
          
          <div className="pr-[30px] mb-4">
            <div className="choose__item flex mb-[50px]">
              <div className="text-end">
              <h4 className="font-bold">Efficient Planning</h4>
              <p className="text-gray-500 ">Our app empowers you with efficient planning tools</p>
              </div>
              <div className="icon__left">
              <Image
                src={choose1png}
                alt="organic"
                width={70}
                height={70}
              />
              </div>
            </div>
          </div>
          <div className="pr-[30px] mb-4">
            <div className="choose__item flex mb-[50px]">
              <div className="text-end">
              <h4 className="font-bold">Collaborative Experience</h4>
              <p className="text-gray-500 ">Work seamlessly with your team and stakeholders. </p>
              </div>
              <div className="icon__left">
              <Image
                src={choose1png}
                alt="organic"
                width={70}
                height={70}
              />
              </div>
            </div>
          </div>
          <div className="pr-[30px] mb-4">
            <div className="choose__item flex mb-[50px]">
              <div className="text-end">
              <h4 className="font-bold">Time-Saving Solutions</h4>
              <p className="text-gray-500 ">Our Event Management App lets you focus on creativity.</p>
              </div>
              <div className="icon__left">
              <Image
                src={choose1png}
                alt="organic"
                width={70}
                height={70}
              />
              </div>
            </div>
          </div>
        </div>
        {/* middle section */}
        <div className="w-full md:w-1/3">
          <div className="mb-8">
          <Image
                src={chooseMiddle2}
                alt="organic"
                width={450}
                height={500}
              />
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="pr-[30px] mb-4">
            <div className="choose__item flex mb-[50px]">
              <div className="text-end">
              <h4 className="font-bold">Customizable Flexibility</h4>
              <p className="text-gray-500 ">Our app provides customizable solutions</p>
              </div>
              <div className="icon__left">
              <Image
                src={choose2png}
                alt="organic"
                width={70}
                height={70}
              />
              </div>
            </div>
          </div>
          <div className="pr-[30px] mb-4">
            <div className="choose__item flex mb-[50px]">
              <div className="text-end">
              <h4 className="font-bold">Real-time Insights</h4>
              <p className="text-gray-500 ">Gain valuable insights with real-time analytics.</p>
              </div>
              <div className="icon__left">
              <Image
                src={choose2png}
                alt="organic"
                width={70}
                height={70}
              />
              </div>
            </div>
          </div>
          <div className="pr-[30px] mb-4">
            <div className="choose__item flex mb-[50px]">
              <div className="text-end">
              <h4 className="font-bold">Enhanced Attendee Experience</h4>
              <p className="text-gray-500 ">Impress your attendees with a seamless experience. </p>
              </div>
              <div className="icon__left">
              <Image
                src={choose2png}
                alt="organic"
                width={70}
                height={70}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
{/*  */}




      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">Proven Track Record at Countless Gatherings</h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
}
