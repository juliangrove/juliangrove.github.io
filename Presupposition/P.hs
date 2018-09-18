{-# LANGUAGE
    TypeFamilies,
    GADTs,
    DataKinds,
    MultiParamTypeClasses,
    FlexibleInstances,
    FlexibleContexts,
    UndecidableInstances,
    InstanceSigs #-}

module P where

import Prelude hiding (Monad(..), (<*>), head, tail)
import Control.Effect
import Model

-- $intro
-- This module defines a datatype constructor 'P' for representing
-- presupposition and defines from it an instance of the /Effect/ class of
-- Orchard, Petricek, and Mycroft. The result is an implementation of the
-- framework for presupposition of chapter 2 of Grove 2019.

-- | 'Seq' is datatype constructor for heterogeneous sequences. The type of its
-- argument is the type of the effect. The resulting datatype comes with
-- functions 'head' and 'tail' for extracting the head and tail of a sequence,
-- respectively.
data Seq p where
  End :: Seq ()
  (:+) :: a -> Seq p -> Seq (a, p)

-- | Sequences can be shown.
instance HelpShowSeq (Seq p) => Show (Seq p) where
  show s = "<" ++ helpShowSeq s

class HelpShowSeq a where
  helpShowSeq :: a -> String

instance HelpShowSeq (Seq ()) where
  helpShowSeq End = ">"

instance Show a => HelpShowSeq (Seq (a, ())) where
  helpShowSeq (a :+ End) = show a ++ ">"

instance (Show a, HelpShowSeq (Seq (b, p))) =>
         HelpShowSeq (Seq (a, (b, p))) where
  helpShowSeq (a :+ s) = show a ++ "; " ++ helpShowSeq s

-- | Sequences can be read.
instance HelpReadSeq (Seq p) => Read (Seq p) where
  readsPrec _ str = let (s:tr) = dropWhile (== ' ') str
                    in if s == '<' then helpReadSeq tr else []

offset :: String -> Int
offset "" = 0
offset (s:tr) = case s of
                  '<' -> offset tr + 1
                  '>' -> offset tr - 1
                  _ -> offset tr

takeFirstOf0 :: ([a] -> Bool) -> [a] -> [a] -> [a]
takeFirstOf0 pred l [] = if pred l then l else []
takeFirstOf0 pred l (x:xs) = if pred l
                             then l
                             else takeFirstOf0 pred (l ++ [x]) xs

takeFirstOf :: ([a] -> Bool) -> [a] -> [a]
takeFirstOf pred l = takeFirstOf0 pred [] l

dropFirstOf0 :: ([a] -> Bool) -> [a] -> [a] -> [a]
dropFirstOf0 pred l [] = if pred l then [] else l
dropFirstOf0 pred l (x:xs) = if pred l
                             then (x:xs)
                             else dropFirstOf0 pred (l ++ [x]) xs

dropFirstOf ::  ([a] -> Bool) -> [a] -> [a]
dropFirstOf pred l = dropFirstOf0 pred [] l

class HelpReadSeq a where
  helpReadSeq :: String -> [(a, String)]

instance HelpReadSeq (Seq ()) where
  helpReadSeq (s:tr) = if s == '>' then [(End, tr)] else []

instance Read a => HelpReadSeq (Seq (a, ())) where
  helpReadSeq str = [(
                       ((read $ init $ takeFirstOf (\l -> offset l == -1) str)
                        :+ End),
                       (dropFirstOf (\l -> offset l == -1) str)
                     )]

instance (Read a, HelpReadSeq (Seq (b, p))) =>
         HelpReadSeq (Seq (a, (b, p))) where
  helpReadSeq str = let
                      f = (\l -> offset l == 0
                                 && length (filter (== ';')
                                             (dropFirstOf
                                               (\m -> length
                                                        (dropWhile (== ' ') m)
                                                      > 0
                                                      && offset m == 0) l))
                                    == 1)
                    in map
                         (\(t, r) ->
                            ((((read $ init $ takeFirstOf f str)
                               :: Read a => a)
                               :+ t), r))
                         ((helpReadSeq $ dropFirstOf f str)
                          :: HelpReadSeq (Seq (b, p)) => [(Seq (b, p), String)])

-- | A function for extracting the 'head' of a sequence.
head :: Seq (a, p) -> a
head (a :+ s) = a

-- | A function for extracting the 'tail' of a sequence.
tail :: Seq (a, p) -> Seq p
tail (a :+ s) = s

-- | A type family corresponding to a monoid whose addition operation is
-- 'MonoidPlus' and whose unit is @()@.
type family MonoidPlus a b where
  MonoidPlus () a = a
  MonoidPlus (a, p) b = (a, MonoidPlus p b)
  
-- | Concatentation for sequences.
(+:+) :: Seq a -> Seq b -> Seq (MonoidPlus a b)
End +:+ s = s
(a :+ s1) +:+ s2 = (a :+ (s1 +:+ s2))

-- | A datatype for Naturals is used at the type level.
data Nat = Zero | Succ Nat deriving Show

-- | Witnesses to the type level Naturals provide parameters for the function
-- 'preAnaph'.
data NatWitness n where
  ZeroW :: NatWitness Zero
  SuccW :: NatWitness n -> NatWitness (Succ n)

-- | A datatype for terms with presuppositions. Its first parameter is the
-- effect, and its second is the type of the value.
newtype P e a = P { runP :: Seq e -> Maybe a }

-- | The type-level function to help type the function 'D.anaph'.
type family Insert i a e where
  Insert (NatWitness Zero) a p = (a, p)
  Insert (NatWitness (Succ n)) a (b, p) = (b, Insert (NatWitness n) a p)

-- | A function for inserting terms into sequences, used in the definition of
-- 'D.anaph'.
insert :: NatWitness n
       -> a
       -> Seq e
       -> Seq (Insert (NatWitness n) a e)
insert ZeroW a e = a :+ e
insert (SuccW n) a (b :+ e) = b :+ insert n a e

-- | A function to implement anaphora resolution for the graded monad 'P'.
preAnaph :: NatWitness n
         -> a
         -> P (Insert (NatWitness n) a e) b
         -> P e b
preAnaph i a m = P $ \s -> runP m $ insert i a s

-- | A class with a method 'seqSplit' for splitting sequences in a way that
-- depends on the desired type of the result. This trick echoes the method
-- defined by Orchard, Petricek, and Mycroft in their definition of the graded
-- Reader monad. The main difference is that, here, the effects are given by
-- sequences, whereas their effects are given by sets.
class SeqSplit s t st where
  seqSplit :: Seq st -> (Seq s, Seq t)

instance SeqSplit () () () where
  seqSplit End = (End, End)

instance SeqSplit () (a, p)  (a, p) where
  seqSplit s = (End, s)

instance SeqSplit (a, p) () (a, p) where
  seqSplit s = (s, End)

instance SeqSplit p1 (b, p2) p3 => SeqSplit (a, p1) (b, p2) (a, p3) where
  seqSplit (a :+ s) = let (s1, s2) = seqSplit s
                      in (a :+ s1, s2)

-- | For any given effect, 'P' is an instance of the /Functor/ class.
instance Functor (P e) where
  fmap f (P g) = P $ \s -> g s >>>>= \x -> Just $ f x

-- | Let's quickly redefine a '>>>>=' for /Maybe/, the original bind of which
-- has been hidden.
(>>>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
Nothing >>>>= f = Nothing
Just a >>>>= f = f a

-- | 'P' is an instance of the /Effect/ class of Orchard, Petricek, and Mycroft.
instance Effect P where
  type Inv P p1 p2 = SeqSplit p1 p2 (MonoidPlus p1 p2)
  
  type Unit P = ()
  type Plus P p1 p2 = MonoidPlus p1 p2

  return :: a -> P () a
  return a = P $ \s -> Just a

  (>>=) :: SeqSplit e f (MonoidPlus e f) =>
           P e a -> (a -> P f b) -> P (MonoidPlus e f) b
  m >>= k = P $ \xy -> let (x, y) = seqSplit xy
                       in runP m x >>>>= \z -> runP (k z) y

-- | The graded monad operator 'upP' is just @return@.
upP :: a -> P () a
upP a = return a

-- | The graded monad operator 'downP' is just @ap@.
downP :: (SeqSplit e (MonoidPlus f ()) (MonoidPlus e (MonoidPlus f ())),
          SeqSplit f () (MonoidPlus f ())) =>
         P e (a -> b) -> P f a -> P (MonoidPlus e (MonoidPlus f ())) b
downP u = \v -> u >>= \f -> v >>= \x -> return $ f x

-- | The graded monad operator 'joinP' is just @join@.
joinP :: SeqSplit f g (MonoidPlus f g) => P f (P g b) -> P (MonoidPlus f g) b
joinP m = m >>= id

-- | The turnstile.
(||-) :: Bool -> a -> Maybe a
True ||- a = Just a
False ||- a = Nothing

-- | Let's define a static meaning for /the/.
theSta :: (Entity -> Bool) -> P (Entity, ()) Entity
theSta = \p -> P $ \s -> p (head s) ||- (head s)
