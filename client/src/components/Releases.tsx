import React from "react";
import ArtistTrackGroup from "./Artist/ArtistTrackGroup";
import TrackgroupGrid from "components/common/TrackgroupGrid";
import api from "services/api";
import { css } from "@emotion/css";
import { useTranslation } from "react-i18next";
import { bp } from "../constants";

const Releases = () => {
  const { t } = useTranslation("translation", { keyPrefix: "releases" });
  const [trackGroups, setTrackGroups] = React.useState<TrackGroup[]>([]);

  React.useEffect(() => {
    const callback = async () => {
      const results = await api.getMany<TrackGroup>("trackGroups");
      setTrackGroups(results.results);
    };

    callback();
  }, []);

  return (
    <div
      className={css`
        @media screen and (max-width: ${bp.medium}px) {
          margin-bottom: 0rem;
        }
      `}
    >
      <h1
        className={css`
          margin-bottom: 1rem;
          line-height: 1em;
          @media screen and (max-width: ${bp.medium}px) {
            margin-bottom: 0.5rem;
          }
        `}
      >
        {t("recentReleases")}
      </h1>
      <div
        className={css`
          display: flex;
          width: 100%;
          flex-direction: row;
          flex-wrap: wrap;
        `}
      >
        <TrackgroupGrid>
          {trackGroups?.map((trackGroup) => (
            <ArtistTrackGroup key={trackGroup.id} trackGroup={trackGroup} />
          ))}
        </TrackgroupGrid>
      </div>
    </div>
  );
};

export default Releases;
