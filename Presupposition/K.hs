{-# LANGUAGE
    FlexibleContexts,
    InstanceSigs #-}

module K where

import Prelude hiding (Monad(..), (<*>), head, tail)
import Control.Effect
import Control.Effect.Parameterised
import Model
import InfoStates
import P
import D

-- $intro
-- This module defines, from 'D', a datatype 'K' for representing presupposition
-- in a continuized format so that one can analyze the semantic contribution of
-- indefinites. We define from 'K' an instance of the 'PMonad' class of Orchard
-- Petricek, and Mycroft. Although 'K' constitutes a parameterized monad in the
-- implementation, these gives rise to graded monads (in real life), given a
-- monoid over the parameters. The result is thus a faithful implementation of
-- the framework for presupposition of chapter 3 of Grove 2019.

-- | We define a datatype constructor 'PContT' for transforming a graded monad
-- into its continuized variant as a parameterized monad.
newtype PContT m r f g a = PContT { runPContT :: (a -> m g r) -> m f r }

-- | The type synonym 'K' transforms 'D' into its continuized variant.
type K e f a = PContT D InfoState e f a

-- | We make 'K' an instance of the 'PMonad' class of Orchard, Petricek, and
-- Mycroft.
instance Effect m => PMonad (PContT m r) where
  return :: a -> PContT m r f f a
  return a = PContT $ \k -> k a

  (>>=) :: PContT m r f e a -> (a -> PContT m r e g b) -> PContT m r f g b
  m >>= f = PContT $ \k -> runPContT m $ \x -> runPContT (f x) k

-- | We define a makeshift parameterized bind to avoid naming conflicts outside
-- the current module.
(>>=>) :: Effect m =>
          PContT m r f e a -> (a -> PContT m r e g b) -> PContT m r f g b
m >>=> f = PContT $ \k -> runPContT m $ \x -> runPContT (f x) k

-- | The parameterized monad operator 'upK' is just 'return'.
upK :: a -> K e e a
upK a = PContT $ \k -> k a

-- | The parameterized monad operator 'downK' is just sequential application.
downK :: K f e (a -> b) -> K e g a -> K f g b
downK u = \v -> u >>=> \f -> v >>=> \x -> upK $ f x

-- | The parameterized monad operator 'joinK' is just join.
joinK :: K f e (K e g b) -> K f g b
joinK m = m >>=> id

-- | For any two chosen parameters, 'K' constitutes a 'Functor'.
instance Effect m => Functor (PContT m r e f) where
  fmap f m = PContT $ \k -> runPContT m (k . f)

-- | We define a 'monadicLift' to transform objects in 'D' to objects in 'K'.
monadicLift :: SeqSplit e f (MonoidPlus e f) => D e a -> K (MonoidPlus e f) f a
monadicLift m = PContT $ \k -> m >>>= k

-- | We define a 'monadicLower' to transform information states in 'K' to
-- information states in 'D'.
monadicLower :: K e () InfoState -> D e InfoState
monadicLower m = runPContT m upD

-- | We define a function for generating a 'newRegister' for use in the
-- semantics of 'a'.
newRegister :: InfoState
newRegister l = Setof [ l ++ [x] | x <- entities ]

-- | We define a function 'a' which provides the meaning of the indefinite
-- article.
a :: (SeqSplit () (MonoidPlus e ()) (MonoidPlus e ()),
      SeqSplit e () (MonoidPlus e ())) =>
     Lift (Entity -> Bool) -> K (MonoidPlus e ()) e (Lift Entity)
a p = PContT $ \k ->
        D $ \i ->
          runD (upD (newRegister >+ (p $ \l -> l !! i)) >@
          (k $ \l -> l !! i)) (succ i)

-- | Let's have an allomorph of 'a' for when it is phonotactically necessary.
an :: (SeqSplit () (MonoidPlus e ()) (MonoidPlus e ()),
       SeqSplit e () (MonoidPlus e ())) =>
      Lift (Entity -> Bool) -> K (MonoidPlus e ()) e (Lift Entity)
an = a
