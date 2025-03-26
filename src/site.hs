--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}

import Data.Monoid (mappend)
import Hakyll
import Text.Pandoc
import Text.Pandoc.Walk (walk)

--------------------------------------------------------------------------------
main :: IO ()
main = hakyll $ do
  match ("css/styles.css"
         .||. "cv/grove_cv.pdf"
         .||. "images/*"
         .||. "slides/*"
        ) $ do
    route idRoute
    compile copyFileCompiler
  match "css/*" $ do
    route idRoute
    compile compressCssCompiler
  match (fromList [ "blog.org"
                  -- , "code.org"
                  , "cv.org"
                  , "dissertation.org"
                  , "index.org"
                  , "papers.org"
                  , "slides.org"
                  , "teaching.org"
                  ]) $ do
    route $ setExtension "html"
    compile $ do
      item1 <- pandocCompilerHandlingAbstract
      item2 <- loadAndApplyTemplate
               "templates/layout.html"
               (defaultContext `mappend` navContext)
               item1
      relativizeUrls item2
  match "templates/*" $ compile templateBodyCompiler


--------------------------------------------------------------------------------
navString :: String -> String
navString currentPage
  = concat $ map (\(str, labels) -> if currentPage `elem` labels
                                   then "<li class=\"active\">"
                                                  ++ str
                                                  ++ "</li>"
                                   else if null labels
                                        then str
                                        else "<li>" ++ str ++ "</li>")
    [ ("<div class=\"navbar-collapse collapse\">\n"
       ++ "<ul class=\"nav navbar-nav\">", [])
    , ("<a href=\"index.html\">about</a>", ["about"])
    , ("<a data-toggle=\"dropdown\" class=\"dropdown-toggle\">research</a>"
       ++ "<ul class=\"dropdown-menu\">"
       ++ "<li><a href=\"papers.html\">papers</a></li>"
       ++ "<li><a href=\"slides.html\">slides</a></li>"
       ++ "<li><a href=\"dissertation.html\">dissertation</a></li>"
       ++ "</ul>"
      , ["research"])
    -- , ("<a href=\"code.html\">code</a>", ["code"])
    , ("<a href=\"cv.html\">cv</a>", ["cv"])
    , ("<a href=\"blog.html\">blog</a>", ["blog"])
    , ("<a href=\"teaching.html\">teaching</a>", ["teaching"])
    , ("</ul>\n</div>", [])
    ]

navContext :: Context a
navContext = functionField "nav" f
  where f [ttl] _ = return $ navString ttl

pandocCompilerHandlingAbstract :: Compiler (Item String)
pandocCompilerHandlingAbstract = do
  let readerOpts = defaultHakyllReaderOptions 
        { readerExtensions = enableExtension Ext_fenced_code_blocks 
          $ readerExtensions defaultHakyllReaderOptions }
  pandoc <- readPandocWith readerOpts =<< getResourceBody
  let transformedPandoc = transformAbstract (itemBody pandoc)
  return $ writePandocWith defaultHakyllWriterOptions (pandoc { itemBody = transformedPandoc })

-- Transform `Div ("",["abstract"],[])` into `<details><summary>`
transformAbstract :: Pandoc -> Pandoc
transformAbstract = walk transformBlock
  where
    transformBlock :: Block -> Block
    transformBlock (Div (_, classes, _) content)
      | "abstract" `elem` classes =
          let summary = [Para [Str "Abstract"]]
              detailsContent = content
              detailsHtml = RawBlock "html" "<details><summary>"
                            : summary
                            ++ RawBlock "html" "</summary>" 
                            : detailsContent
                            ++ [RawBlock "html" "</details>"]
          in Div ("", [], []) detailsHtml
    transformBlock block = block
