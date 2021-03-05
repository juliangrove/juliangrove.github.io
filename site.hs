--------------------------------------------------------------------------------
{-# LANGUAGE
    OverloadedStrings #-}

import Hakyll

--------------------------------------------------------------------------------
main :: IO ()
main = hakyll $ do
  match ("blog/*"
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
                  , "code.org"
                  , "cv.org"
                  , "dissertation.org"
                  , "index.org"
                  , "papers.org"
                  , "slides.org"
                  ]) $ do
    route $ setExtension "html"
    compile $ do
      item1 <- pandocCompiler
      item2 <- loadAndApplyTemplate
               "templates/layout.html"
               defaultContext
               item1
      relativizeUrls item2
  match "templates/*" $ compile templateBodyCompiler


--------------------------------------------------------------------------------
