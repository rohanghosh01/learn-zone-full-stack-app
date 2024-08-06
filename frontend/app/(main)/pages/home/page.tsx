"use client";
import React, { Suspense } from "react";
import { Feed } from "@/components/feed/feed";
// import { feeds } from "../../../../mock/feeds";
import { CreateFeed } from "@/components/feed/create-feed";
import { FeedSkeleton } from "@/components/feed/feed-skeleton";
import { useEffect, useState } from "react";
import Loader from "@/components/loading";
import * as API from "../../../../services/api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { UserSuggestionCard } from "@/components/user-suggestion";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState<any | []>([]);
  const [query, setQuery] = useState({
    limit: 10,
    offset: 0,
  });
  const [isMore, setIsMore] = useState(true);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      const updatedOffset = query.offset + query.limit;
      setQuery({
        ...query,
        offset: updatedOffset,
      });
    }
  };

  const getFeeds = async (updatedQuery = query, refetch?: any) => {
    if (!isMore) return;
    try {
      let res: any = await API.feedList(updatedQuery);

      if (refetch) {
        setFeeds(res.results);
      } else {
        if (res && res.results && res.results.length) {
          setFeeds((prev: any) => {
            const existingIds = new Set(prev.map((item: any) => item.id));
            const filteredData = res.results.filter(
              (ele: any) => !existingIds.has(ele.id)
            );

            return [...prev, ...filteredData];
          });
        }
      }
      if (res && res.results && res.results.length) {
        setFeeds((prev: any) => {
          const existingIds = new Set(prev.map((item: any) => item.id));
          const filteredData = res.results.filter(
            (ele: any) => !existingIds.has(ele.id)
          );

          return [...prev, ...filteredData];
        });
      }
    } catch (error: any) {
      if (error.message == "404") {
        setIsMore(false);
      }
      // console.log("error get feed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeeds();

    // Scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [query]);

  useEffect(() => {
    setIsMore(true);
  }, []);

  const handleUpdateFeeds = () => {
    setQuery({
      limit: 10,
      offset: 0,
    });
    getFeeds(
      {
        limit: 10,
        offset: 0,
      },
      true
    );
  };

  const reloadFeed = () => {
    toast.success("You are up to date");
    getFeeds(
      {
        limit: 10,
        offset: 0,
      },
      true
    );
  };
  return (
    <div className="h-full md:mb-0 mb-20 flex justify-center gap-10">
      <div className="flex flex-col items-center justify-center  text-muted-foreground">
        <Button
          className="flex justify-center items-center gap-1 mt-1"
          variant="ghost"
          onClick={reloadFeed}
        >
          <span>Reload feeds</span>
          <RefreshCcw className="w-4 h-4" />
        </Button>

        <div className="w-[150px] h-10 m-4 overflow-hidden">
          <CreateFeed
            loading={loading}
            setLoading={setLoading}
            onUpdateFeeds={handleUpdateFeeds}
            feeds={feeds}
            setFeeds={setFeeds}
          />
        </div>

        <div className="flex mt-10 mb-10 flex-col items-center gap-10 justify-center">
          {loading ? (
            <React.Fragment>
              {Array.from({ length: 5 }, (_, index) => (
                <FeedSkeleton key={index} />
              ))}
            </React.Fragment>
          ) : (
            <>
              {feeds && feeds?.length ? (
                feeds.map((feed: any, index: number) => (
                  <Feed
                    key={index}
                    data={feed}
                    onUpdateFeeds={handleUpdateFeeds}
                    feeds={feeds}
                    setFeeds={setFeeds}
                  />
                ))
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <img src="/assets/no-results-found.png" alt="no-records" />
                  <h2 className="text-xl font-bold">
                    Sorry there are no feeds available
                  </h2>
                </div>
              )}
            </>
          )}
        </div>

        {loading && <Loader />}
      </div>

      <div className="mt-40 xl:block hidden">
        <UserSuggestionCard />
      </div>
    </div>
  );
}
