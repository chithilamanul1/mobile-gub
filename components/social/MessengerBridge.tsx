
"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function MessengerBridge() {
    const { data: session } = useSession()
    const pageId = "100064777429812" // Mobile HUB Page ID

    useEffect(() => {
        // Only load Messenger bridge for authenticated members to maintain exclusivity
        if (!session) return

        // Initialize Facebook SDK
        const initFbSDK = () => {
            (window as any).fbAsyncInit = function () {
                (window as any).FB.init({
                    xfbml: true,
                    version: 'v21.0'
                });
            };

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s) as HTMLScriptElement;
                js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
                fjs.parentNode?.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

        initFbSDK()

        return () => {
            // Cleanup: remove the SDK script and the chat plugin div if needed
            const script = document.getElementById('facebook-jssdk')
            if (script) script.remove()
        }
    }, [session])

    if (!session) return null

    return (
        <>
            <div id="fb-root"></div>
            <div
                id="fb-customer-chat"
                className="fb-customerchat"
                //@ts-ignore
                attribution="install_control"
                page_id={pageId}
            >
            </div>
        </>
    )
}
