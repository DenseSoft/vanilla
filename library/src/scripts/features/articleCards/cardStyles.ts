/*
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

import {
    absolutePosition,
    borders,
    colorOut,
    debugHelper,
    defaultTransition,
    paddings,
    unit,
    userSelect,
    IBackground,
} from "@library/styles/styleHelpers";
import { globalVariables } from "@library/styles/globalStyleVars";
import { shadowHelper, shadowOrBorderBasedOnLightness } from "@library/styles/shadowHelpers";
import { TLength } from "typestyle/lib/types";
import { styleFactory, useThemeCache, variableFactory } from "@library/styles/styleUtils";
import { ColorHelper, percent } from "csx";
import { FontSizeProperty, HeightProperty, MarginProperty, PaddingProperty, WidthProperty } from "csstype";
import { url } from "inspector";
interface IBody {
    backgroundImage: IBackground;
}

export const cardVariables = useThemeCache(() => {
    const globalVars = globalVariables();
    const cardVars = variableFactory("card");

    const spacing = cardVars("spacing", {
        twoColumns: 24,
        threeColumns: 9,
        fourColumns: 17,
        color: globalVars.mainColors.primary as ColorHelper,
    });

    const frame = cardVars("frame", {
        height: 90 as PaddingProperty<TLength>,
        width: 90 as PaddingProperty<TLength>,
        bottomMargin: 16 as MarginProperty<TLength>,
    });

    const title = cardVars("title", {
        fontSize: globalVars.fonts.size.large as FontSizeProperty<TLength>,
        lineHeight: globalVars.lineHeights.condensed,
        marginBottom: 6,
    });

    const description = cardVars("description", {
        fontSize: globalVars.fonts.size.medium as FontSizeProperty<TLength>,
        marginTop: 6,
        lineHeight: globalVars.lineHeights.excerpt,
    });

    const link = cardVars("link", {
        padding: {
            top: 0,
            bottom: 24,
            left: 0,
            right: 0,
        },
        fg: globalVars.mainColors.fg,
        bg: globalVars.mainColors.bg,
        twoColumnsMinHeight: 0,
        threeColumnsMinHeight: 0,
        fourColumnsMinHeight: 0,
    });

    const content = cardVars("content", {
        padding: {
            left: 16,
            right: 16,
        },
    });

    const fallBackIcon = cardVars("fallBackIcon", {
        width: 90 as WidthProperty<TLength>,
        height: 90 as HeightProperty<TLength>,
        fg: globalVars.mainColors.primary,
    });

    const cardBox = cardVars("cardBox", {
        enabled: false,
    });

    return {
        spacing,
        frame,
        title,
        description,
        link,
        fallBackIcon,
        content,
        cardBox,
    };
});

export const cardClasses = useThemeCache(() => {
    const vars = cardVariables();
    const globalVars = globalVariables();
    const style = styleFactory("card");
    const shadow = shadowHelper();

    const root = (columns?: number) => {
        return style({
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            width: percent(100),
            flexGrow: 1,
            margin: "auto",
            ...userSelect(),
        });
    };

    const link = (columns?: number) => {
        let minHeight;

        switch (columns) {
            case 2:
                minHeight = vars.link.twoColumnsMinHeight;
                break;
            case 3:
                minHeight = vars.link.threeColumnsMinHeight;
                break;
            case 4:
                minHeight = vars.link.fourColumnsMinHeight;
                break;
            default:
                minHeight = 0;
        }

        return style("link", {
            // ...defaultTransition("box-shadow", "border"),
            ...paddings(vars.link.padding),
            display: "block",
            position: "relative",
            cursor: "pointer",
            flexGrow: 1,
            color: colorOut(globalVars.mainColors.fg),
            backgroundColor: colorOut(vars.link.bg),
            borderRadius: unit(2),
            minHeight: unit(minHeight ?? 0),
            /* ...shadowOrBorderBasedOnLightness(
                globalVars.body.backgroundImage.color,
                borders({
                    color: vars.link.fg.fade(0.3),
                }),
                shadow.embed(),
            ),*/
            textDecoration: "none",
            boxSizing: "border-box",
            $nest: {
                "&:hover": {
                    textDecoration: "none",
                    /* ...shadowOrBorderBasedOnLightness(
                        globalVars.body.backgroundImage.color,
                        borders({
                            color: vars.link.fg.fade(0.5),
                        }),
                        shadow.embedHover(),
                    ),*/
                },
            },
        });
    };

    const cardBorder = style("cardBorder", {
        ...defaultTransition("box-shadow", "border"),
        ...shadowOrBorderBasedOnLightness(
            globalVars.body.backgroundImage.color,
            borders({
                color: vars.link.fg.fade(0.3),
            }),
            shadow.embed(),
        ),
        $nest: {
            "&:hover": {
                ...shadowOrBorderBasedOnLightness(
                    globalVars.body.backgroundImage.color,
                    borders({
                        color: vars.link.fg.fade(0.5),
                    }),
                    shadow.embedHover(),
                ),
            },
        },
    });

    const main = style("main", {
        position: "relative",
    });

    const frame = (columns?: number) => {
        let height;
        let width;

        height = vars.frame.height;
        width = vars.frame.width;

        switch (columns) {
            case 2:
                height = vars.frame.height;
                width = vars.frame.width;
                break;
            case 3:
            case 4:
            default:
                height = 72;
                width = 72;
        }
        return style("imageFrame", {
            display: "flex",
            //alignItems: "center",
            //justifyContent: "center",
            position: "relative",
            height: unit(height),
            width: unit(width),
            marginTop: "auto",
            // marginRight: "auto",
            // marginLeft: "auto",
            marginBottom: unit(vars.frame.bottomMargin),
        });
    };

    const image = style("image", {
        display: "block",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        margin: "auto",
        height: "auto",
        maxWidth: percent(100),
        maxHeight: percent(100),
    });

    const title = style("title", {
        fontSize: unit(vars.title.fontSize),
        lineHeight: vars.title.lineHeight,
        marginBottom: unit(vars.title.marginBottom),
    });

    const description = style("description", {
        position: "relative",
        marginTop: unit(vars.description.marginTop),
        fontSize: unit(vars.description.fontSize),
        lineHeight: vars.description.lineHeight,
    });

    const fallBackIcon = style("fallbackIcon", {
        ...absolutePosition.middleOfParent(),
        width: unit(vars.fallBackIcon.width),
        height: unit(vars.fallBackIcon.height),
        color: vars.fallBackIcon.fg.toString(),
    });

    const content = style("content", {
        ...paddings(vars.content.padding),
        textAlign: "left",
    });

    return {
        root,
        link,
        frame,
        content,
        image,
        main,
        title,
        description,
        fallBackIcon,
        cardBorder,
    };
});
