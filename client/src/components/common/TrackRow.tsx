import { css } from "@emotion/css";
import React from "react";
import { FiLink } from "react-icons/fi";
import { useGlobalStateContext } from "state/GlobalState";

import Button from "./Button";
import { fmtMSS, isTrackOwnedOrPreview, widgetUrl } from "utils/tracks";
import { useSnackbar } from "state/SnackbarContext";
import { bp } from "../../constants";
import TrackRowPlayControl from "./TrackRowPlayControl";

const TrackRow: React.FC<{
  track: Track;
  trackGroup: TrackGroup;
  addTracksToQueue: (id: number) => void;
}> = ({ track, addTracksToQueue, trackGroup }) => {
  const snackbar = useSnackbar();
  const { dispatch } = useGlobalStateContext();
  const [trackTitle] = React.useState(track.title);
  const {
    state: { user },
  } = useGlobalStateContext();

  const canPlayTrack = isTrackOwnedOrPreview(track, user, trackGroup);

  const onTrackPlay = React.useCallback(() => {
    if (canPlayTrack) {
      addTracksToQueue?.(track.id);
      dispatch({ type: "setPlaying", playing: true });
    }
  }, [addTracksToQueue, canPlayTrack, dispatch, track.id]);

  return (
    <tr
      key={track.id}
      id={`${track.id}`}
      onClick={onTrackPlay}
      className={css`
        ${!canPlayTrack
          ? `color: var(--mi-normal-foreground-color); opacity: .3;`
          : ""}

        &:hover {
          color: var(--mi-normal-background-color) !important;
          ${!canPlayTrack
            ? `background-color: var(--mi-normal-foreground-color);`
            : `background-color: var(--mi-normal-foreground-color) !important;`}

          button {
            color: var(--mi-normal-background-color);
            background: transparent;
          }
        }

        button {
          color: var(--mi-normal-foreground-color);
          background: transparent;
          font-size: 0.8rem;

          &:hover {
            color: var(--mi-normal-background-color) !important;
            background: transparent;
          }
        }

        > td > .play-button {
          display: none;
        }
        > td > .track-number {
          display: block;
        }
        &:hover > td > .play-button {
          display: block;
          width: 2rem;
        }
        &:hover > td > .track-number {
          display: none;
        }
        @media screen and (max-width: ${bp.small}px) {
          td {
            padding: 0.15rem 0.3rem;
          }
          span {
            width: 1rem !important;
            margin-right: 1rem !important;
          }
        }
      `}
    >
      <td
        className={css`
          height: 30px;

          button {
            padding: 0.5rem 0.65rem 0.5rem 0.4rem !important;
            background: none;
          }
          button:hover {
            padding: 0.5rem 0.65rem 0.5rem 0.4rem !important;
            background: none !important;
          }
          @media screen and (max-width: ${bp.small}px) {
            button {
              padding: 0.5rem 0.65rem 0.5rem 0.1rem !important;
              background: none;
            }
            button:hover {
              padding: 0.5rem 0.65rem 0.5rem 0.1rem !important;
              background: none !important;
            }
          }
        `}
      >
        <TrackRowPlayControl
          trackId={track.id}
          canPlayTrack={canPlayTrack}
          trackNumber={track.order}
          onTrackPlayCallback={addTracksToQueue}
        />
      </td>
      <td
        className={css`
          width: 100%;
          padding: 0rem;
          margin: 0rem;
        `}
      >
        <div
          className={css`
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            padding: 0.1rem;
            margin-bottom: 0rem;
            justify-content: space-between;
            align-items: center;

            &:hover {
              cursor: pointer;
            }

            @media screen and (max-width: ${bp.small}px) {
              flex-wrap: nowrap;
            }
          `}
        >
          <div
            className={css`
          overflow: hidden;
          text-overflow: ellipsis;

          @media screen and (max-width: ${bp.medium}px) {
            font-size: .9rem;
          }

          @media screen and (max-width: ${bp.small}px) {
              td {
                padding: 0.15rem 0.3rem;
              }
        `}
          >
            {trackTitle}
          </div>
          <div
            className={css`
              font-size: 0.9rem;
              @media screen and (max-width: ${bp.medium}px) {
                font-size: 0.7rem;
                font-weight: bold;
                margin-left: 0.2rem;
                td {
                  padding: 0.15rem 0.3rem;
                }
              }
            `}
          >
            {track.audio?.duration && fmtMSS(track.audio.duration)}
          </div>
        </div>
      </td>
      <td align="right">
        <Button
          compact
          iconOnly
          transparent
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(widgetUrl(track.id));
            snackbar("Copied track url", { type: "success" });
          }}
          startIcon={<FiLink />}
          className={css`
            .startIcon {
              padding-left: 1rem;
            }
            :hover {
              background: transparent !important;
              opacity: 0.6;
            }
          `}
        ></Button>
      </td>
    </tr>
  );
};
export default TrackRow;
